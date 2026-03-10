from collections import deque

def solve_water_jug():
    # User Input
    j1_cap = int(input("Enter capacity of Jug 1: "))
    j2_cap = int(input("Enter capacity of Jug 2: "))
    target = int(input("Enter target amount: "))
    
    queue = deque([((0, 0), [])])
    visited = set()
    visited.add((0, 0))

    while queue:
        (curr_j1, curr_j2), path = queue.popleft()

        # Check if target is reached in either jug
        if curr_j1 == target or curr_j2 == target:
            print("\nSolution Found!")
            for i, step in enumerate(path + [(curr_j1, curr_j2)]):
                print(f"Step {i}: {step}")
            return

        # Define all possible moves
        moves = [
            (j1_cap, curr_j2),         # Fill Jug 1
            (curr_j1, j2_cap),         # Fill Jug 2
            (0, curr_j2),              # Empty Jug 1
            (curr_j1, 0),              # Empty Jug 2
            # Pour Jug 2 into Jug 1
            (min(j1_cap, curr_j1 + curr_j2), curr_j2 - (min(j1_cap, curr_j1 + curr_j2) - curr_j1)),
            # Pour Jug 1 into Jug 2
            (curr_j1 - (min(j2_cap, curr_j1 + curr_j2) - curr_j2), min(j2_cap, curr_j1 + curr_j2))
        ]

        for next_state in moves:
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, path + [(curr_j1, curr_j2)]))

    print("\nNo solution possible.")
# Run the solver
solve_water_jug()