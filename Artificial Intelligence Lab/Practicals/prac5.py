import itertools

def solve_cryptarithm(word1, word2, result):
    letters = set(word1 + word2 + result)
    if len(letters) > 10:
        print("Too many unique letters (max 10 allowed).")
        return

    letters = list(letters)
    first_letters = {word1[0], word2[0], result[0]}

    for perm in itertools.permutations(range(10), len(letters)):
        mapping = dict(zip(letters, perm))

        # No leading zero
        if any(mapping[ch] == 0 for ch in first_letters):
            continue

        def word_to_number(word):
            return int("".join(str(mapping[ch]) for ch in word))

        num1 = word_to_number(word1)
        num2 = word_to_number(word2)
        num3 = word_to_number(result)

        if num1 + num2 == num3:
            print("\n")
            print("Solution Found:")
            print(mapping)
            print(f"{num1} + {num2} = {num3}\n")


# -------- USER INPUT --------
word1 = input("Enter first word: ").upper()
word2 = input("Enter second word: ").upper()
result = input("Enter result word: ").upper()

solve_cryptarithm(word1, word2, result)