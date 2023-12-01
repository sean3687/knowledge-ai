import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import Image from 'next/image';
import { Thumbnail } from 'react-pdf';

const FilePreview = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex">
            <div className="w-1/4 overflow-y-auto">
                {/* Generate Thumbnail for each page */}
                {Array.from(new Array(numPages), (el, index) => (
                    <Thumbnail
                        key={`thumb-${index + 1}`}
                        file={file}
                        pageNumber={index + 1}
                        onThumbnailClick={(pageNum) => setCurrentPage(pageNum)}
                    />
                ))}
            </div>
            <div className="w-3/4">
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={currentPage} />
                </Document>
            </div>
        </div>
    );
};

export default FilePreview;
