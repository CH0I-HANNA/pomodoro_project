import axiosInstance from './axios';

export interface UserProfile {
    nickname: string;
    email: string;
    profileImageUrl: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
};

export const updateUsername = async (newUsername: string): Promise<void> => {
    await axiosInstance.put('/user/profile', { nickname: newUsername });
};

export const updateProfilePhoto = async (photoFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', photoFile);

    const response = await axiosInstance.post('/user/profile/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
};