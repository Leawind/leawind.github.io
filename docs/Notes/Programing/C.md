```c

void printBin8(UINT8 a) {
	putchar((1 << 7) & a ? '1' : '0');
	putchar((1 << 6) & a ? '1' : '0');
	putchar((1 << 5) & a ? '1' : '0');
	putchar((1 << 4) & a ? '1' : '0');
	putchar((1 << 3) & a ? '1' : '0');
	putchar((1 << 2) & a ? '1' : '0');
	putchar((1 << 1) & a ? '1' : '0');
	putchar((1 << 0) & a ? '1' : '0');
}

void printBin16(UINT16 a) {
	printBin8(*((UINT8*)&a + 1));
	putchar(' ');
	printBin8(*((UINT8*)&a + 0));
}

void printBin32(UINT32 a) {
	printBin16(*((UINT16*)&a + 1));
	putchar(' ');
	printBin16(*((UINT16*)&a + 0));
}

void printBin64(UINT64 a) {
	printBin32(*((UINT32*)&a + 1));
	putchar(' ');
	printBin32(*((UINT32*)&a + 0));
}

```
