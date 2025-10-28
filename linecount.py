import os

extensions = {
    '.html': 'HTML',
    '.css': 'CSS',
    '.js': 'JavaScript'
}

totals = {ext: 0 for ext in extensions}
files = []

for root, _, filenames in os.walk('.'):
    for name in filenames:
        for ext in extensions:
            if name.endswith(ext):
                path = os.path.join(root, name)
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                        count = sum(1 for _ in f)
                        files.append((path, count, ext))
                        totals[ext] += count
                except:
                    continue

path_width = max(len(path) for path, _, _ in files) if files else 0
count_width = max(len(str(count)) for _, count, _ in files) if files else 0
header = f"{'File'.ljust(path_width)} : {'Lines'.rjust(count_width)}"
separator = '-' * len(header)

print(header)
print(separator)
for path, count, _ in files:
    print(f"{path.ljust(path_width)} : {str(count).rjust(count_width)}")

print("\nBreakdown by type:")
label_width = max(len(label) for label in extensions.values())
type_count_width = max(len(str(v)) for v in totals.values())

for ext, label in extensions.items():
    print(f"{label.ljust(label_width)} : {str(totals[ext]).rjust(type_count_width)}")

print(f"\n{'Total lines'.ljust(label_width)} : {str(sum(totals.values())).rjust(type_count_width)}")

