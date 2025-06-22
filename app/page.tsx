"use client"

import { useState, useRef, useEffect } from "react"
import { Editor } from "@monaco-editor/react"
import { Play, Download, Copy, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const languages = [
  { id: "javascript", name: "JavaScript", defaultCode: 'console.log("Hello, World!");' },
  {
    id: "typescript",
    name: "TypeScript",
    defaultCode: 'const message: string = "Hello, World!";\nconsole.log(message);',
  },
  { id: "python", name: "Python", defaultCode: 'print("Hello, World!")' },
  {
    id: "java",
    name: "Java",
    defaultCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    id: "cpp",
    name: "C++",
    defaultCode:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  },
  {
    id: "c",
    name: "C",
    defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  {
    id: "html",
    name: "HTML",
    defaultCode:
      "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>",
  },
  {
    id: "css",
    name: "CSS",
    defaultCode:
      "body {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(45deg, #8A2BE2, #4B0082);\n    color: white;\n    text-align: center;\n    padding: 50px;\n}",
  },
  {
    id: "go",
    name: "Go",
    defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  },
  { id: "php", name: "PHP", defaultCode: '<?php\necho "Hello, World!";\n?>' },
  { id: "sql", name: "SQL", defaultCode: 'SELECT "Hello, World!" as message;' },
  { id: "ruby", name: "Ruby", defaultCode: 'puts "Hello, World!"' },
  { id: "rust", name: "Rust", defaultCode: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: "kotlin", name: "Kotlin", defaultCode: 'fun main() {\n    println("Hello, World!")\n}' },
  { id: "swift", name: "Swift", defaultCode: 'import Swift\nprint("Hello, World!")' },
]

export default function VioletEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState(languages[0].defaultCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef(null)

  const currentLanguage = languages.find((lang) => lang.id === selectedLanguage)

  useEffect(() => {
    if (currentLanguage) {
      setCode(currentLanguage.defaultCode)
    }
  }, [selectedLanguage, currentLanguage])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("Running...")

    try {
      if (selectedLanguage === "javascript") {
        // Capture console.log output
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "))
        }

        try {
          // Execute the JavaScript code
          eval(code)
          setOutput(logs.join("\n") || "Code executed successfully (no output)")
        } catch (error) {
          setOutput(`Error: ${error}`)
        } finally {
          console.log = originalLog
        }
      } else if (selectedLanguage === "html") {
        // For HTML, we can show a preview
        setOutput("HTML Preview:\n(In a real implementation, this would show in an iframe)")
      } else {
        // For other languages, show a mock execution message
        setOutput(`${currentLanguage?.name} code would be executed on a server.\nOutput: Hello, World!`)
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    }

    setIsRunning(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      go: "go",
      php: "php",
      sql: "sql",
      ruby: "rb",
      rust: "rs",
      kotlin: "kt",
      swift: "swift",
    }

    const extension = extensions[selectedLanguage] || "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-violet-500/20 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
                Code Editor
              </h1>
              <div className="hidden md:block text-sm text-gray-400">Multi-language code editor</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-black text-white border-violet-500/30 hover:bg-violet-500/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Editor Panel */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Editor Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg border border-violet-500/20">
              <div className="flex items-center space-x-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48 bg-black border-violet-500/30 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-violet-500/30">
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id} className="text-white hover:bg-violet-500/20">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  className="bg-black text-white border-violet-500/30 hover:bg-violet-500/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={downloadCode}
                  variant="outline"
                  size="sm"
                  className="bg-black text-white border-violet-500/30 hover:bg-violet-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={runCode} disabled={isRunning} className="bg-violet-600 hover:bg-violet-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 border border-violet-500/20 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  selectionHighlight: false,
                  occurrencesHighlight: "off",
                }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-violet-400">Output</h2>
              <Button
                onClick={() => setOutput("")}
                variant="outline"
                size="sm"
                className="bg-black text-white border-violet-500/30 hover:bg-violet-500/10"
              >
                Clear
              </Button>
            </div>

            <div className="flex-1 bg-gray-900/50 border border-violet-500/20 rounded-lg p-4 font-mono text-sm overflow-auto">
              {output ? (
                <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
              ) : (
                <div className="text-gray-500 italic">Click "Run" to execute your code and see the output here.</div>
              )}
            </div>

            {/* Language Info */}
            <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-violet-500/10">
              <h3 className="text-sm font-semibold text-violet-400 mb-2">{currentLanguage?.name} Info</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Language: {currentLanguage?.name}</div>
                <div>
                  File extension: .
                  {selectedLanguage === "javascript"
                    ? "js"
                    : selectedLanguage === "typescript"
                      ? "ts"
                      : selectedLanguage === "python"
                        ? "py"
                        : selectedLanguage}
                </div>
                <div className="mt-2 text-violet-300">
                  {selectedLanguage === "javascript" && "Supports live execution in browser"}
                  {selectedLanguage === "html" && "Markup language for web pages"}
                  {selectedLanguage === "css" && "Styling language for web pages"}
                  {!["javascript", "html", "css"].includes(selectedLanguage) && "Server-side execution required"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
