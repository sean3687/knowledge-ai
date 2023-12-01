import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import Mammoth from 'mammoth';
import Image from 'next/image';

const FileThumbnail = ({ file, type, onThumbnailClick }) => {
    const [thumbnailSrc, setThumbnailSrc] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clean up function to revoke object URL if needed
        const cleanUp = () => {
            if (file instanceof File) {
                URL.revokeObjectURL(thumbnailSrc);
            }
        };

        if (type === 'image') {
            const imageUrl = file instanceof File ? URL.createObjectURL(file) : file;
            setThumbnailSrc(imageUrl);
            setLoading(false);
        } else if (type === 'pdf') {
            const loadingTask = window.PDFJS.getDocument(file);
            loadingTask.promise.then((pdf) => {
                pdf.getPage(1).then((page) => {
                    const viewport = page.getViewport({ scale: 0.2 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    page.render(renderContext).promise.then(() => {
                        setThumbnailSrc(canvas.toDataURL());
                        setLoading(false);
                        canvas.remove();
                    });
                });
            });
        } else if (type === 'docx') {
            Mammoth.convertToHtml({ arrayBuffer: file })
                .then(result => {
                    setThumbnailSrc('data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="50">DOCX</text></svg>`)); // Placeholder for DOCX
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }

        return cleanUp;
    }, [file, type]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Image
            src={thumbnailSrc}
            alt="File thumbnail"
            onClick={() => onThumbnailClick()}
            className="w-24 h-24 object-cover" // Tailwind classes for size and cover
        />
    );
};

export default FileThumbnail;
