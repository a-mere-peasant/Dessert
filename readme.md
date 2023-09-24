
# Dessert


Dessert is a byte sized vimly typed language. It can get you anywhere (within 8 bits). It can be fit anywhere in your stack as there's always room for dessert!

Dessert works on a store of size 1 byte (8 bits), using vim-like motion commands to move the pointer (which initially sits at the 0th bit) in the store and operate on the bits. It has a no lookahead type interpretation as it simply does not care what you're typing next. There are no types to worry about .All of it's commands are single characters which conform to the spirit of this language.

Try it out [here](https://a-mere-peasant.github.io/_pages/dessert.html)

Commands can be used for movement, operations and enabling/disabling visual block

### Movement
The following commands can be used for moving the pointer

```
h : Move left
l : Move right
```
if on the edge of the store, dessert will not throw an error but will also not move the pointer, so `lllllllll` will only get the pointer to the last bit and not beyond.

### Bit Flips (setting the bits)

The bit at the current pointer position can be flipped using the following commands

```
j : Flips a bit to 0
k : Flips a bit to 1
```


### Operations

Dessert has support for the following operations 
```
+ : Add
- : Subtract
& : Logical and
| : Logical or
= : Equality
```
Yes, the `=` is for equality since dessert does not have any "assignment". These operations are preformed on the current pointer and the movement followed right after the operation. Operations in dessert are FCFS (First Come First Serve) so the expression 
```
10 + 5 * 2

```
evaluates to `15 *2` which is `30` rather than `10 + 10` which is `20`. In Dessert, the math is always mathin' (because you decide how that works). Only one operation can be in play at one time, so the program `llk+-l` will error.

### Visual Block

The `v` command can be used to enter and exit a visual block which can be used to group bits together. The value of the block is calculated as a number with the binary representation. For example if you have the following state
```
[ 0 0 0 1 1 1 0 0 ]
          ^
```
where the array denotes the store and `^` is the pointer. If you now have the following program
```
vhhkhhv
```
the state now becomes 

```
[ 0 0 1 1 1 1 0 0 ]
  ^ _ _ _ _
```

Where the `_` denotes bits in the visual block, do note that the bit at the pointer is also included in the block. This makes the block's value `1*1 + 1*2 + 1*4 + 0*16 + 0*32` which is `7`. The expression is always evaluated from right to left and the relative visual block start and pointer positions do not matter. Operations can be performed after just ending the visual block just as for normal bits.



In case you didn't notice, you can flip bits within the visual block, although no other operations are permissible.

