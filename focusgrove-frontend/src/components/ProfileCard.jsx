// src/components/ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUsername, updateProfilePhoto, logout } from '../api/userApi';


const ProfileCard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newName, setNewName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const profile = await fetchUserProfile();
                setUser(profile);
                setNewName(profile.nickname || '');
            } catch (err) {
                setError("프로필 정보를 가져오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChangeName = async () => {
        if (!newName.trim()) return;
        setIsUpdatingName(true);

        try {
            await updateUsername(newName);
            setUser(prev => ({ ...prev, nickname: newName }));
        } catch (err) {
            setError("이름 변경에 실패했습니다.");
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUpdatingPhoto(true);

        try {
            const newUrl = await updateProfilePhoto(file);
            setUser(prev => ({ ...prev, profileImageUrl: newUrl }));
        } catch (err) {
            setError("사진 업로드 실패");
        } finally {
            setIsUpdatingPhoto(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            localStorage.removeItem('jwtToken'); // Clear the token
            window.location.href = "/login";
        } catch {
            setError("로그아웃 실패");
        }
        setIsLoggingOut(false);
    };

    if (loading)
        return (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-center animate-fadeInUp">
                Loading profile...
            </div>
        );

    if (!user)
        return (
            <div className="backdrop-blur-xl bg-white/10 p-6 text-red-400 text-center rounded-xl animate-fadeInUp">
                {error || "Error loading profile"}
            </div>
        );

    return (
        <div
            className="
                backdrop-blur-xl bg-white/5 border border-white/20
                rounded-2xl shadow-2xl p-6
                min-w-0 transition duration-300
                hover:bg-white/10 animate-fadeInUp text-white
            "
        >
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
                <div
                    className="
                        w-40 h-40 rounded-full overflow-hidden bg-white/10
                        shadow-lg border border-white/10
                        hover:scale-105 transition-all duration-300
                    "
                >
                    <img
                        src={user.profileImageUrl || "/new_default.png"}
                        className="w-full h-full object-cover"
                        alt="profile"
                    />
                </div>

                <input
                    type="file"
                    id="profilePhotoInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{display: "none"}}
                />
            </div>

            {/* NAME SECTION */}
            <div className="flex flex-col items-center mb-6">
                {!isEditing ? (
                    <>
                        <p className="text-3xl font-extrabold text-center mb-1">
                            {user.nickname || '이름 없음'}
                        </p>
                    </>
                ) : (
                    <>
                        {/* Input */}
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                            className="
                                text-2xl font-bold text-center mb-2
                                bg-white/10 backdrop-blur-xl
                                px-4 py-2 rounded-xl border border-white/20
                                focus:border-teal-300 outline-none
                            "
                        />

                        {/* Save Cancel Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    await handleChangeName();
                                    setIsEditing(false);
                                }}
                                disabled={isUpdatingName}
                                className="
                                    px-4 py-1 rounded-lg text-sm
                                    bg-teal-400/30 text-teal-300 border border-teal-500/40
                                    hover:bg-teal-400/40 transition disabled:opacity-50
                                "
                            >
                                저장
                            </button>

                            <button
                                onClick={() => {
                                    setNewName(user.nickname || '');
                                    setIsEditing(false);
                                }}
                                className="
                                    px-4 py-1 rounded-lg text-sm
                                    bg-white/10 border border-white/20
                                    hover:bg-white/20 transition
                                "
                            >
                                취소
                            </button>
                        </div>
                    </>
                )}

                <p className="text-white/60 text-sm mt-2">{user.email}</p>
            </div>


            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setIsEditing(true)}
                    className="
                                flex-1 py-2 rounded-lg text-sm font-medium
                                bg-white/10 border border-white/10
                                hover:bg-white/20 transition duration-200
                                disabled:opacity-50
                            "
                >
                    {isUpdatingName ? "Saving..." : "이름 변경"}
                </button>

                <button
                    onClick={() => document.getElementById("profilePhotoInput").click()}
                    disabled={isUpdatingPhoto}
                    className="
                                flex-1 py-2 rounded-lg text-sm font-medium
                                bg-white/10 border border-white/10
                                hover:bg-white/20 transition duration-200
                                disabled:opacity-50
                    "
                >
                    {isUpdatingPhoto ? "Uploading..." : "사진 변경"}
                </button>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="
                    w-full py-2 rounded-lg text-sm font-bold
                    text-red-400 bg-red-900/20 border border-red-500/20
                    hover:bg-red-900/40 transition disabled:opacity-50
                "
            >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
        </div>
    );
};

export default ProfileCard;
