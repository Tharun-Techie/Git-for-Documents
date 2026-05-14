import { useState, useMemo, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { History, Share2, GitBranch, GitMerge, Wifi, WifiOff } from 'lucide-react'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [status, setStatus] = useState('connecting')

  // Memoize Yjs document and provider to prevent recreation
  const { ydoc, provider } = useMemo(() => {
    const doc = new Y.Doc()
    const p = new WebsocketProvider('ws://localhost:3001/collaboration', 'document-1', doc)
    return { ydoc: doc, provider: p }
  }, [])

  useEffect(() => {
    provider.on('status', ({ status }: { status: string }) => {
      setStatus(status)
    })

    return () => {
      provider.disconnect()
      ydoc.destroy()
    }
  }, [provider, ydoc])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Turn off history so Yjs can handle it
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: 'User ' + Math.floor(Math.random() * 100),
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        }
      })
    ],
    content: '', // Content is synced from Yjs
  })

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar - Version History & Branches */}
      {isSidebarOpen && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              History
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                Branches
              </div>
              <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-100">
                main
              </div>
              <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm cursor-pointer transition-colors">
                legal-review
              </div>
            </div>
            
            <hr className="border-gray-200" />

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Commits</div>
              
              {/* Mock Commits */}
              <div className="relative pl-4 border-l-2 border-gray-200 pb-4">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-800">Updated NDA clause</p>
                <p className="text-xs text-gray-500 mt-1">John Doe • 10:42 AM</p>
              </div>
              
              <div className="relative pl-4 border-l-2 border-gray-200 pb-4">
                <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1 border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-800">Fixed formatting</p>
                <p className="text-xs text-gray-500 mt-1">Jane Smith • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative h-full">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <History className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-800 leading-tight">Project Phoenix - NDA</h1>
                {status === 'connected' ? (
                  <Wifi className="w-4 h-4 text-green-500" title="Connected" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" title="Disconnected" />
                )}
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit mt-0.5">Drafting</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold z-20">JD</div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold z-10">JS</div>
            </div>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <GitMerge className="w-4 h-4" />
              Commit
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center pb-32">
          <div className="w-full max-w-[850px] bg-white shadow-md border border-gray-200 rounded-lg shrink-0">
            {editor ? (
              <EditorContent editor={editor} className="prose max-w-none p-10 focus:outline-none min-h-[800px]" />
            ) : (
              <div className="flex items-center justify-center h-[800px] text-gray-400">
                Loading editor...
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
