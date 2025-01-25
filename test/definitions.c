#include <stdio.h>
#include <math.h>
#include <string.h>

// Function declarations
void func1(void);
int func2(int a, float b);
static double func3(void);
extern char *func4(char *str);
inline long func5(int x);
const int *func6(volatile int *p);
int (*func7(int x))(float);

// Function definitions

// 1. Function returning void, no arguments
void func1(void)
{
    printf("This is func1: No arguments and no return value.\n");
}

// 2. Function returning int, two arguments
int func2(int a, float b)
{
    return a + (int)b; // Add the integer and truncated float
}

// 3. Static function returning double
static double func3(void)
{
    return 3.14159; // Return a constant value
}

// 4. External function returning a char pointer
extern char *func4(char *str)
{
    static char buffer[100];
    strncpy(buffer, str, sizeof(buffer) - 1); // Copy the input string to a static buffer
    buffer[sizeof(buffer) - 1] = '\0';        // Ensure null-termination
    return buffer;
}

// 5. Inline function returning long
inline long func5(int x)
{
    return (long)x * x; // Return the square of the input as a long
}

// 6. Function returning a pointer to const int
const int *func6(volatile int *p)
{
    return p; // Simply return the pointer as a const int*
}

// 7. Function returning a pointer to a function
int helperFunction(float value)
{
    return (int)round(value); // Round the float and return as int
}

int (*func7(int x))(float)
{
    (void)x; // Use the argument if needed; here it is unused
    return helperFunction;
}

// Main function to test all examples
int main()
{
    // 1. func1
    func1();

    // 2. func2
    int sum = func2(3, 4.5);
    printf("func2: Sum = %d\n", sum);

    // 3. func3
    double pi = func3();
    printf("func3: Pi = %f\n", pi);

    // 4. func4
    char *copied = func4("Hello, world!");
    printf("func4: Copied string = %s\n", copied);

    // 5. func5
    long square = func5(7);
    printf("func5: Square = %ld\n", square);

    // 6. func6
    volatile int num = 42;
    const int *ptr = func6(&num);
    printf("func6: Pointer value = %d\n", *ptr);

    // 7. func7
    int (*funcPointer)(float) = func7(0);
    int rounded = funcPointer(8.7);
    printf("func7: Rounded = %d\n", rounded);

    return 0;
}
