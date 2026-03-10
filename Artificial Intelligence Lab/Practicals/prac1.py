def magicsquare(n):
    if n % 2 == 0:
        raise ValueError("n must be odd")
    magic_square = [[0] * n for _ in range(n)]
    row = 0
    col = n // 2
    for num in range(1, n*n + 1):
        magic_square[row][col] = num
        new_row = (row - 1) % n
        new_col = (col + 1) % n
        if magic_square[new_row][new_col] != 0:
            row = (row + 1) % n
        else:
            row = new_row
            col = new_col
    return magic_square
n = 3
magic_square = magicsquare(n)
print("3x3 Magic Square:")
for row in magic_square:
    print(row)