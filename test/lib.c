#include <stdio.h>
#include <string.h>

int hello()
{
    return 42;
}

int func2(int a, float b)
{
    return a + (int)b; // Add the integer and truncated float
}

void func1()
{
    printf("This is func1: No arguments and no return value.\n");
}

void double_number(int *x)
{
    *x = 2 * *x;
}
