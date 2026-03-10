import heapq

def astar(graph, h, start, goal):
    pq = [(h[start], 0, start)]
    came, cost = {}, {start: 0}

    while pq:
        _, g, u = heapq.heappop(pq)
        if u == goal:
            path = [u]
            while u in came:
                u = came[u]
                path.append(u)
            return path[::-1]

        for v, w in graph[u]:
            ng = g + w
            if v not in cost or ng < cost[v]:
                cost[v] = ng
                heapq.heappush(pq, (ng + h[v], ng, v))
                came[v] = u
    return None

# -------- User Input --------
n = int(input("Number of nodes: "))
graph = {i: [] for i in range(n)}

e = int(input("Number of edges: "))
print("Edges: u v cost (directed)")
for _ in range(e):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))   # directed edge

print("Heuristic values:")
h = {i: int(input(f"h({i}) = ")) for i in range(n)}

start = int(input("Start node: "))
goal = int(input("Goal node: "))

print("Path:", astar(graph, h, start, goal))