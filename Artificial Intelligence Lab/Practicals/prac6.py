def ab(n,d,a,b,m):
    if d==0: return n
    if m:
        v=float('-inf')
        for c in n:
            v=max(v,ab(c,d-1,a,b,0)); a=max(a,v)
            if a>=b: break
        return v
    else:
        v=float('inf')
        for c in n:
            v=min(v,ab(c,d-1,a,b,1)); b=min(b,v)
            if a>=b: break
        return v

print("Enter 8 leaf node values:")
v=list(map(int,input().split()))
if len(v)!=8: exit()

tree=[[[v[0],v[1]],[v[2],v[3]]],[[v[4],v[5]],[v[6],v[7]]]]
best=ab(tree,3,float('-inf'),float('inf'),1)

levels=[
    [f"A (MAX) = {best}"],
    ["B (MIN)","C (MIN)"],
    ["D (MAX)","E (MAX)","F (MAX)","G (MAX)"],
    v
]

w=80
print("\nGame Tree:\n")
for i,l in enumerate(levels):
    s=w//(2**i+1)
    print(("".join(str(x).center(s) for x in l)).center(w))

print("\nOptimal Value at Root (A):",best)
