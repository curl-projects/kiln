import { useState, useEffect } from 'react';
import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

export function useCustomReadability() {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        if (document) {
            const documentClone = document.cloneNode(true);
            const parsedArticle = new Readability(documentClone).parse();
            const sanitizedContent = DOMPurify.sanitize(parsedArticle.content);
            setArticle({ sanitizedContent, ...parsedArticle });
        } else {
            throw new Error("Cannot access document object");
        }
    }, []);

    return article;
}
