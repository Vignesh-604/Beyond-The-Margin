import React, { useState, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from "react-markdown";
import 'simplemde/dist/simplemde.min.css';
import "github-markdown-css/github-markdown.css";

const MarkdownEditor = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState("## Start writing...");

    const options = useMemo(() => ({
        toolbar: [
            'bold',
            'italic',
            'heading',
            '|',
            'quote',
            'unordered-list',
            'ordered-list',
            'quote'
        ]
    }), []);

    const onSubmit = () => {
        const articleData = {
            title,
            subtitle,
            content
        };

        console.log("Submitted Article:", articleData);
    };

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            <div>
                <label htmlFor="" className='font-semibold mb-2'> Article Title</label>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md text-lg bg-gray-200 text-black font-semibold shadow-md"
                />
            </div>
            <div>
                <label htmlFor="" className='font-semibold '> Article Subtitle</label>
                <textarea
                    type="text" rows={2}
                    placeholder="Subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-200 text-black resize-none"
                />
            </div>
            <div>
                <label htmlFor="" className='font-semibold '> Article Content</label>
                <SimpleMDE value={content} onChange={setContent} options={options} />
            </div>

            <button
                onClick={onSubmit}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
                Submit for approval
            </button>

            <h2 className="mt-6 text-xl font-semibold text-black">Preview</h2>
            <div className="markdown-body border rounded p-4">
                <h1>{title}</h1>
                <p><em>{subtitle}</em></p>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};

export default MarkdownEditor;
