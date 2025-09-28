/**
 * File Management API Service
 * Handles all file-related API calls
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { ApiResponse } from '../types';

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  resource: string;
  createdAt: string;
}

export interface DeleteMultipleFilesRequest {
  fileIds: string[];
}

export class FileService {
  /**
   * Upload single file
   */
  async uploadSingle(file: File, resource: string = 'tool'): Promise<ApiResponse<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource', resource);

    return apiClient.post<FileUploadResponse>(API_ENDPOINTS.FILES.UPLOAD_SINGLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: File[], resource: string = 'tool'): Promise<ApiResponse<FileUploadResponse[]>> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('resource', resource);

    return apiClient.post<FileUploadResponse[]>(API_ENDPOINTS.FILES.UPLOAD_MULTIPLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get file URL for display
   */
  getFileUrl(resource: string, filename: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}${API_ENDPOINTS.FILES.STATIC(resource, filename)}`;
  }

  /**
   * Delete single file
   */
  async deleteFile(fileId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.FILES.DELETE(fileId));
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(fileIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.request<void>({
      method: 'DELETE',
      url: API_ENDPOINTS.FILES.DELETE_MULTIPLE,
      data: { fileIds },
    });
  }
}

// Export singleton instance
export const fileService = new FileService();
