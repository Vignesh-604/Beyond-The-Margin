import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from "react-markdown";
import 'simplemde/dist/simplemde.min.css';
import "github-markdown-css/github-markdown.css";
import { categories } from '../../Utils/data';
import { 
  showConfirmationAlert, 
  showSuccessAlert, 
  showErrorAlert, 
  showValidationErrorAlert 
} from '../../Utils/alerts';
import { useAuth } from '../../Utils/context';
import Loading from '../../Components/Loading';

const MarkdownEditor = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [showPreview, setShowPreview] = useState(true);
    const [formValid, setFormValid] = useState(false);

      const { currentUser } = useAuth()
      const navigate = useNavigate()
      const [loading, setLoading] = useState(true)
    
      useEffect(() => {
        if (!currentUser) navigate(-1)
        else setLoading(false)
      }, [])

    // Check form validity whenever inputs change
    useEffect(() => {
        validateForm();
    }, [title, subtitle, content, selectedCategory, selectedSubcategory]);

    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(cat => cat.category === selectedCategory);
            setAvailableSubcategories(category ? category.subcategories : []);
            setSelectedSubcategory('');
        } else {
            setAvailableSubcategories([]);
            setSelectedSubcategory('');
        }
    }, [selectedCategory]);

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

    // Validate all form fields
    const validateForm = () => {
        const isValid = 
            title.trim() !== '' && 
            subtitle.trim() !== '' && 
            content.trim() !== '' && 
            selectedCategory !== '' && 
            selectedCategory !== 'All Categories' &&
            selectedSubcategory !== '' && 
            selectedSubcategory !== 'All Subcategories';
        
        setFormValid(isValid);
        return isValid;
    };

    // Get validation errors for feedback
    const getValidationErrors = () => {
        const errors = [];
        
        if (!title.trim()) errors.push('Title is required');
        if (!subtitle.trim()) errors.push('Subtitle is required');
        if (!content.trim()) errors.push('Content is required');
        if (!selectedCategory || selectedCategory === 'All Categories') errors.push('Please select a category');
        if (!selectedSubcategory || selectedSubcategory === 'All Subcategories') errors.push('Please select a subcategory');
        
        return errors;
    };

    const handleSubmitClick = () => {
        const errors = getValidationErrors();
        
        if (errors.length > 0) {
            showValidationErrorAlert(errors);
            return;
        }
        
        showConfirmationAlert({
            title: 'Submit Article',
            text: 'Are you sure you want to submit this article for approval?',
            icon: 'question',
            confirmButtonText: 'Yes, Submit',
            onConfirm: submitArticle
        });
    };

    const submitArticle = () => {
        const formData = {
            title,
            subtitle,
            content,
            category: selectedCategory,
            subCategory: selectedSubcategory
        };

        axios.post('/api/articles', formData)
            .then(res => {
                const articleId = res.data.data._id;
                showSuccessAlert(
                    'Article Submitted', 
                    'Your article has been submitted successfully and is awaiting approval.'
                );
                navigate(`/articles/${articleId}`);
            })
            .catch(error => {
                console.error("Error submitting article:", error);
                showErrorAlert(
                    'Submission Failed', 
                    'There was an error submitting your article. Please try again later.'
                );
            });
    };

    if (loading) return <Loading />

    return (
        <div className="p-4 max-w-7xl mx-auto font-serif tracking-wider space-y-4">
            <div>
                <label htmlFor="title" className='font-semibold mb-2'>Article Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md text-lg bg-gray-200 text-black font-semibold shadow-md"
                />
            </div>
            <div>
                <label htmlFor="subtitle" className='font-semibold'>Article Subtitle</label>
                <textarea
                    id="subtitle"
                    rows={2}
                    placeholder="Subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-200 text-black resize-none tracking-wider shadow-md"
                />
            </div>
            <div>
                <label htmlFor="content" className='font-semibold'>Article Content</label>
                <div className='tracking-wide'>
                    <SimpleMDE id="content" value={content} onChange={setContent} options={options} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Category Dropdown */}
                    <div className="w-full md:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat.category}>{cat.category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Dropdown */}
                    <div className="w-full md:w-64">
                        <select
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            disabled={!selectedCategory}
                            className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">All Subcategories</option>
                            {availableSubcategories.map((subcat, index) => (
                                <option key={index} value={subcat}>{subcat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSubmitClick}
                    disabled={!formValid}
                    className={`px-4 py-2 rounded-md w-full md:w-auto transition-colors ${
                        formValid 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                    }`}
                >
                    Submit for approval
                </button>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-black">Content Preview</h2>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
            </div>

            {showPreview && (
                <div className="markdown-body border rounded p-4 mt-2 font-serif">
                    <h1>{title}</h1>
                    <p><em>{subtitle}</em></p>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default MarkdownEditor;