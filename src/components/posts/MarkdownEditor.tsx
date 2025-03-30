import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Bold, Italic, List, ListOrdered, Image, LinkIcon } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  error,
}: MarkdownEditorProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleUnorderedList = () => insertMarkdown('\n- ');
  const handleOrderedList = () => insertMarkdown('\n1. ');
  const handleImage = () => insertMarkdown('![alt text](', ')');
  const handleLink = () => insertMarkdown('[link text](', ')');

  return (
    <div className="neobrutalism-card">
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}
        className="w-full"
      >
        <TabList className="flex border-b-2 border-black mb-4">
          <Tab
            className="px-4 py-2 font-bold cursor-pointer border-2 border-black border-b-0 mr-2 rounded-t-md"
            selectedClassName="bg-blue-500 text-white"
          >
            Write
          </Tab>
          <Tab
            className="px-4 py-2 font-bold cursor-pointer border-2 border-black border-b-0 rounded-t-md"
            selectedClassName="bg-blue-500 text-white"
          >
            Preview
          </Tab>
        </TabList>

        <TabPanel>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBold}
              leftIcon={<Bold className="w-4 h-4" />}
            >
              Bold
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleItalic}
              leftIcon={<Italic className="w-4 h-4" />}
            >
              Italic
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUnorderedList}
              leftIcon={<List className="w-4 h-4" />}
            >
              List
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOrderedList}
              leftIcon={<ListOrdered className="w-4 h-4" />}
            >
              Numbered List
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImage}
              leftIcon={<Image className="w-4 h-4" />}
            >
              Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLink}
              leftIcon={<LinkIcon className="w-4 h-4" />}
            >
              Link
            </Button>
          </div>

          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your content in Markdown...'}
            className="min-h-[300px]"
            error={error}
          />
        </TabPanel>

        <TabPanel>
          <div className="min-h-[300px] p-4 border-2 border-black rounded-md prose max-w-none">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                Preview will appear here...
              </p>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor;
