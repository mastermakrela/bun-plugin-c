import { plugin, type BunPlugin, type PluginBuilder } from "bun";
import { cc, type FFIFunction, FFIType } from "bun:ffi";
import { cparse } from "./cparse";

const _c_plugin = {
	name: "bun-plugin-c",
	target: "bun",
	setup: function (build: PluginBuilder): void | Promise<void> {
		build.onLoad({ filter: /\.c$/ }, async (args) => {
			console.log(`🦔 ~ file: plugin.ts:10 ~ build.onLoad ~ args:`, args);
			const symbols = await extract_symbols(args.path);

			const { symbols: exports } = cc({
				source: args.path,
				symbols,
			});

			const __types = type_helper_for(symbols);

			console.log(`
Imported ${args.path} with following functions:

import _lib from "${args.path}";

interface lib {
${__types}}

const lib = _lib as lib;

`);

			return {
				exports: {
					__types,
					...exports,
					default: exports,
				},
				loader: "object",
			};
		});
	},
} satisfies BunPlugin;

const c_plugin = await plugin(_c_plugin);

export { c_plugin };
export default c_plugin;

async function extract_symbols(path: string): Promise<Record<string, FFIFunction>> {
	const contents = await Bun.file(path).text();

	const prepared = contents.replaceAll(/#include\s*<.*>/g, "");

	const ast = cparse(prepared, { file: path });
	const result: Record<string, FFIFunction> = {};

	function toFFIType(t: any): FFIType {
		if (t.type === "PointerType") return FFIType.ptr;
		switch (t.name) {
			case "int":
				return FFIType.int;
			case "float":
				return FFIType.float;
			case "double":
				return FFIType.double;
			case "void":
				return FFIType.void;
			default:
				return FFIType.ptr;
		}
	}

	for (const node of ast) {
		if (node.type === "FunctionDeclaration" || node.type === "FunctionDefinition") {
			result[node.name] = {
				args: (node.arguments || []).map((arg: any) => toFFIType(arg.defType)),
				returns: toFFIType(node.defType),
			};
		}
	}
	return result;
}

function type_helper_for(symbols: Record<string, FFIFunction>): string {
	const typeMap: Record<number, string> = {
		0: "FFIType.char",
		1: "FFIType.int8_t",
		2: "FFIType.uint8_t",
		3: "FFIType.int16_t",
		4: "FFIType.uint16_t",
		5: "FFIType.int32_t",
		6: "FFIType.uint32_t",
		7: "FFIType.int64_t",
		8: "FFIType.uint64_t",
		9: "FFIType.double",
		10: "FFIType.float",
		11: "FFIType.bool",
		12: "FFIType.ptr",
		13: "FFIType.void",
		14: "FFIType.cstring",
		15: "FFIType.i64_fast",
		16: "FFIType.u64_fast",
		17: "FFIType.function",
		18: "FFIType.napi_env",
		19: "FFIType.napi_value",
		20: "FFIType.buffer",
	};

	let code = "";
	for (const [name, ffi] of Object.entries(symbols)) {
		const args = ffi.args
			.map((arg) => typeMap[arg] || "unknown")
			.map((a, idx) => `_${idx}: ` + a)
			.join(", ");
		const returns = typeMap[ffi.returns] || "unknown";
		code += `${name}(${args}): ${returns};\n`;
	}
	return code;
}
