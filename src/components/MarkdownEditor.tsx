import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
	return (
		<div data-color-mode="light">
			<MDEditor value={value} onChange={(value?: string) => onChange(value || "")} height={400} />
		</div>
	);
};

export default MarkdownEditor;
