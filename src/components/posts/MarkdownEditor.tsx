// import React, { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import {
//   Bold,
//   Italic,
//   List,
//   ListOrdered,
//   Quote,
//   Code,
//   Eye,
//   Edit,
// } from 'lucide-react';
// import MarkdownImageUploader from './MarkdownImageUploader';

// interface MarkdownEditorProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   error?: string;
// }

// const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
//   value,
//   onChange,
//   placeholder,
//   error,
// }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   const insertMarkdown = (markdown: string) => {
//     const textarea = document.getElementById(
//       'markdown-textarea',
//     ) as HTMLTextAreaElement;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const text = textarea.value;

//     const before = text.substring(0, start);
//     const after = text.substring(end, text.length);

//     const newText = before + markdown + after;
//     onChange(newText);

//     // Set focus back to textarea with cursor after the inserted text
//     setTimeout(() => {
//       textarea.focus();
//       textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
//     }, 0);
//   };

//   const handleImageInsert = (markdownText: string) => {
//     insertMarkdown(markdownText);
//   };

//   const insertToolbarMarkdown = (type: string) => {
//     const textarea = document.getElementById(
//       'markdown-textarea',
//     ) as HTMLTextAreaElement;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = textarea.value.substring(start, end);

//     let markdown = '';

//     switch (type) {
//       case 'bold':
//         markdown = `**${selectedText || 'bold text'}**`;
//         break;
//       case 'italic':
//         markdown = `*${selectedText || 'italic text'}*`;
//         break;
//       case 'unordered-list':
//         markdown = selectedText
//           ? selectedText
//               .split('\n')
//               .map((line) => `- ${line}`)
//               .join('\n')
//           : '- list item';
//         break;
//       case 'ordered-list':
//         markdown = selectedText
//           ? selectedText
//               .split('\n')
//               .map((line, i) => `${i + 1}. ${line}`)
//               .join('\n')
//           : '1. list item';
//         break;
//       case 'quote':
//         markdown = selectedText
//           ? selectedText
//               .split('\n')
//               .map((line) => `> ${line}`)
//               .join('\n')
//           : '> quote';
//         break;
//       case 'code':
//         markdown = selectedText
//           ? `\`\`\`\n${selectedText}\n\`\`\``
//           : '```\ncode block\n```';
//         break;
//       default:
//         markdown = selectedText;
//     }

//     const text = textarea.value;
//     const before = text.substring(0, start);
//     const after = text.substring(end, text.length);

//     const newText = before + markdown + after;
//     onChange(newText);

//     // Set focus back to textarea
//     setTimeout(() => {
//       textarea.focus();
//       textarea.selectionStart = start;
//       textarea.selectionEnd = start + markdown.length;
//     }, 0);
//   };

//   // Custom renderer that handles base64 images correctly for preview
//   // const customRenderers = {
//   //   img: ({ node, ...props }: any) => {
//   //     return (
//   //       <img
//   //         {...props}
//   //         alt={props.alt || 'Image'}
//   //         className="max-w-full h-auto my-4 rounded-md"
//   //       />
//   //     );
//   //   },
//   // };

//   const customRenderers = {
//     img: ({ src, alt, ...props }: any) => {
//       if (props.src === '') {
//         props.src = null;

//         console.log('Empty image source detected');
//       }
//       return (
//         <img
//           {...props}
//           src={src}
//           alt={src || 'Image'}
//           // alt={props.alt || 'Image'}
//           className="max-w-full h-auto my-4 rounded-md"
//         />
//       );
//     },
//   };

//   return (
//     <div
//       className={`border rounded-md ${
//         error ? 'border-red-500' : 'border-gray-300'
//       }`}
//     >
//       <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
//         <TabList className="flex border-b">
//           <Tab
//             className={`p-3 border-r cursor-pointer flex items-center ${
//               activeTab === 0 ? 'bg-gray-100' : ''
//             }`}
//             selectedClassName="font-bold"
//           >
//             <Edit className="w-4 h-4 mr-2" />
//             Edit
//           </Tab>
//           <Tab
//             className={`p-3 cursor-pointer flex items-center ${
//               activeTab === 1 ? 'bg-gray-100' : ''
//             }`}
//             selectedClassName="font-bold"
//           >
//             <Eye className="w-4 h-4 mr-2" />
//             Preview
//           </Tab>

//           {/* Only show toolbar in edit mode */}
//           {activeTab === 0 && (
//             <div className="flex ml-auto border-l">
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('bold')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Bold"
//               >
//                 <Bold className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('italic')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Italic"
//               >
//                 <Italic className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('unordered-list')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Unordered List"
//               >
//                 <List className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('ordered-list')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Ordered List"
//               >
//                 <ListOrdered className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('quote')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Quote"
//               >
//                 <Quote className="w-4 h-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => insertToolbarMarkdown('code')}
//                 className="p-3 hover:bg-gray-100"
//                 title="Code"
//               >
//                 <Code className="w-4 h-4" />
//               </button>
//               <div className="p-3 hover:bg-gray-100">
//                 <MarkdownImageUploader onImageInsert={handleImageInsert} />
//               </div>
//             </div>
//           )}
//         </TabList>

//         <TabPanel>
//           <textarea
//             id="markdown-textarea"
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className="w-full min-h-[300px] p-4 focus:outline-none resize-y"
//           />
//         </TabPanel>

//         <TabPanel>
//           <div className="markdown-preview min-h-[300px] p-4 prose max-w-none">
//             {value ? (
//               <ReactMarkdown components={customRenderers}>
//                 {value}
//               </ReactMarkdown>
//             ) : (
//               <p className="text-gray-400">
//                 {placeholder || 'No content to preview'}
//               </p>
//             )}
//           </div>
//         </TabPanel>
//       </Tabs>

//       {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default MarkdownEditor;

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  Edit,
  ImageOff,
} from 'lucide-react';
import MarkdownImageUploader from './MarkdownImageUploader';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

// Custom component to handle image rendering with fallbacks
const ImageRenderer = ({ src, alt }: { src: string; alt?: string }) => {
  // Fallback for empty src
  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 my-4">
        <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-gray-500">Missing image source</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Image'}
      className="max-w-full h-auto my-4 rounded-md"
      onError={(e) => {
        // Replace the image element with our error UI
        const parent = e.currentTarget.parentNode;
        if (parent) {
          const errorDiv = document.createElement('div');
          errorDiv.className =
            'flex flex-col items-center justify-center p-4 border border-dashed border-red-300 rounded-md bg-red-50 my-4';
          errorDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-red-400 mb-2">
              <path d="M6.13 1 6 16a2 2 0 0 0 2 2h15"></path>
              <path d="m1 5 5-4 5 4"></path>
              <line x1="16" y1="10" x2="22" y2="10"></line>
              <line x1="19" y1="7" x2="19" y2="13"></line>
              <line x1="2" y1="19" x2="22" y2="19"></line>
            </svg>
            <span class="text-red-500">Failed to load image</span>
          `;
          parent.replaceChild(errorDiv, e.currentTarget);
        }
      }}
    />
  );
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const insertMarkdown = (markdown: string) => {
    const textarea = document.getElementById(
      'markdown-textarea',
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = before + markdown + after;
    onChange(newText);

    // Set focus back to textarea with cursor after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
    }, 0);
  };

  const handleImageInsert = (markdownText: string) => {
    insertMarkdown(markdownText);
  };

  const insertToolbarMarkdown = (type: string) => {
    const textarea = document.getElementById(
      'markdown-textarea',
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let markdown = '';

    switch (type) {
      case 'bold':
        markdown = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        markdown = `*${selectedText || 'italic text'}*`;
        break;
      case 'unordered-list':
        markdown = selectedText
          ? selectedText
              .split('\n')
              .map((line) => `- ${line}`)
              .join('\n')
          : '- list item';
        break;
      case 'ordered-list':
        markdown = selectedText
          ? selectedText
              .split('\n')
              .map((line, i) => `${i + 1}. ${line}`)
              .join('\n')
          : '1. list item';
        break;
      case 'quote':
        markdown = selectedText
          ? selectedText
              .split('\n')
              .map((line) => `> ${line}`)
              .join('\n')
          : '> quote';
        break;
      case 'code':
        markdown = selectedText
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : '```\ncode block\n```';
        break;
      default:
        markdown = selectedText;
    }

    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = before + markdown + after;
    onChange(newText);

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + markdown.length;
    }, 0);
  };

  // Custom renderers for markdown
  const customRenderers = {
    img: (props: any) => <ImageRenderer src={props.src} alt={props.alt} />,
  };

  return (
    <div
      className={`border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex border-b">
          <Tab
            className={`p-3 border-r cursor-pointer flex items-center ${
              activeTab === 0 ? 'bg-gray-100' : ''
            }`}
            selectedClassName="font-bold"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Tab>
          <Tab
            className={`p-3 cursor-pointer flex items-center ${
              activeTab === 1 ? 'bg-gray-100' : ''
            }`}
            selectedClassName="font-bold"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Tab>

          {/* Only show toolbar in edit mode */}
          {activeTab === 0 && (
            <div className="flex ml-auto border-l">
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('bold')}
                className="p-3 hover:bg-gray-100"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('italic')}
                className="p-3 hover:bg-gray-100"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('unordered-list')}
                className="p-3 hover:bg-gray-100"
                title="Unordered List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('ordered-list')}
                className="p-3 hover:bg-gray-100"
                title="Ordered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('quote')}
                className="p-3 hover:bg-gray-100"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertToolbarMarkdown('code')}
                className="p-3 hover:bg-gray-100"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <div className="p-3 hover:bg-gray-100">
                <MarkdownImageUploader onImageInsert={handleImageInsert} />
              </div>
            </div>
          )}
        </TabList>

        <TabPanel>
          {/* <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-4 focus:outline-none resize-y"
          /> */}

          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-4 focus:outline-none resize-y custom-scrollbar"
          ></textarea>
        </TabPanel>

        <TabPanel>
          <div className="markdown-preview min-h-[300px] p-4 prose max-w-none">
            {value ? (
              <ReactMarkdown components={customRenderers}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">
                {placeholder || 'No content to preview'}
              </p>
            )}
          </div>
        </TabPanel>
      </Tabs>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MarkdownEditor;
