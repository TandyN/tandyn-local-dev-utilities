# 🧰 local-dev-utlities

Some local scripts for dev operations

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g tandyn-local-dev-utilities
```

---

## 🧪 Available Commands

### 🔪 `get_and_kill_ports`

Kill all processes bound to specified ports.

```bash
get_and_kill_ports 3000,8080
```

---

### 📁 `copy_files`

Copy a file or directory (recursively) to a target destination.

```bash
copy_files ./src ./backup
copy_files ./file.txt ./dest-folder/
```

---

### 🧼 `remove_files`

Delete a file or directory (recursively).

```bash
remove_files ./temp.txt
remove_files ./build/
```

---

### 📝 `replace_in_code`

Search and replace text in files with customizable filters.

```bash
replace_in_code -search_text "TODO" -replace_text "DONE"
replace_in_code -search_text "var" -replace_text "let" -directory ./src -extensions .js,.ts
```

**Options:**

- `-search_text <string>`: (required) Text to search for
- `-replace_text <string>`: (required) Replacement text
- `-directory <path>`: Directory to search in (default: current working directory)
- `-ignore_dirs <dirs>`: Comma-separated directories to ignore (default: `node_modules,.git,.venv,dist,build`)
- `-extensions <exts>`: Comma-separated extensions to target (default: `.js,.ts,.py`)

---

## 🛠 Built With

- TypeScript
- Node.js

