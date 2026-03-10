import math
b = [' '] * 9
w = [(0,1,2),(3,4,5),(6,7,8),
     (0,3,6),(1,4,7),(2,5,8),
     (0,4,8),(2,4,6)]
print("TIC TAC TOE (Human=X, Computer=O)")
print("1 2 3\n4 5 6\n7 8 9\n")
turn = 'X'
while True:
    print(b[0],"|",b[1],"|",b[2])
    print("--+---+--")
    print(b[3],"|",b[4],"|",b[5])
    print("--+---+--")
    print(b[6],"|",b[7],"|",b[8],"\n")
    for a,c,d in w:
        if b[a]==b[c]==b[d]=='X':
            print("Human wins")
            exit()
        if b[a]==b[c]==b[d]=='O':
            print("Computer wins")
            exit()
    if ' ' not in b:
        print("Draw!")
        exit()
    if turn == 'X':
        m = int(input("Enter move (1-9): ")) - 1
        if m < 0 or m > 8 or b[m] != ' ':
            print("Invalid move! Try again.\n")
            continue
        b[m] = 'X'
        turn = 'O'
    else:
        best = -math.inf
        move = 0
        for i in range(9):
            if b[i] == ' ':
                b[i] = 'O'
                score = 0
                for j in range(9):
                    if b[j] == ' ':
                        b[j] = 'X'
                        if any(b[a]==b[c]==b[d]=='X' for a,c,d in w):
                            score = -1
                        b[j] = ' '

                b[i] = ' '
                if score > best:
                    best = score
                    move = i
        b[move] = 'O'
        turn = 'X