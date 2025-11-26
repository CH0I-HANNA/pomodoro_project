import React from 'react';

const TodaySentence = ({
                           dailyLog,
                           isEditing,
                           newQuote,
                           setNewQuote,
                           handleEdit,
                           handleCancel,
                           handleSave
                       }) => {
    const isEmpty = !dailyLog || dailyLog.trim().length === 0;

    return (
        <div
            className="
                relative
                backdrop-blur-xl
                bg-white/5
                border border-white/20
                rounded-2xl
                shadow-2xl
                p-6
                w-full
                min-h-[160px]
                min-w-3
                hover:bg-white/15
                transition duration-300
                items-center
                justify-center
                animate-[fadeInUp_0.7s_ease-out]

                flex flex-col   /* 중앙 배치 */
                text-center
            "
        >

            <h2 className="text-4xl font-semibold text-white mb-4 flex items-center justify-center tracking-wide">
                <span className="mr-2 text-3xl text-custom-orange">💡</span> Today’s Sentence
            </h2>

            {!isEditing ? (
                <>
                    {isEmpty ? (
                        <div
                            className="
                                text-white/40 italic text-xl
                                min-h-[70px] py-6 animate-pulse select-none
                                text-center
                            "
                        >
                            아직 작성된 한마디가 없어요.
                        </div>
                    ) : (
                        <p
                            className="
                                text-white text-4xl mt-2 px-2 min-h-[70px]
                                font-medium italic text-center
                                animate-[highlight_1.5s_ease-out]
                            "
                        >
                            " {dailyLog} "
                        </p>
                    )}

                    <button
                        onClick={handleEdit}
                        className="
                            absolute top-5 right-5
                            bg-white/10 text-white/80 border border-white/10
                            backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold
                            hover:bg-white/20 transition duration-200
                        "
                    >
                        수정
                    </button>
                </>
            ) : (
                <div className="mt-2 w-full animate-[fadeIn_0.4s_ease-out]">
                    <textarea
                        value={newQuote}
                        onChange={(e) => setNewQuote(e.target.value)}
                        rows="3"
                        className="
                            w-full bg-white/10 border border-white/20
                            text-white text-lg rounded-xl p-3
                            backdrop-blur-md focus:outline-none focus:ring-2
                            focus:ring-custom-orange/60 transition duration-200
                        "
                    />

                    <div className="mt-3 flex justify-end space-x-3 w-full">
                        <button
                            onClick={handleCancel}
                            className="
                                bg-white/10 text-white border border-white/20
                                backdrop-blur-md py-2 px-5 rounded-lg
                                text-md font-semibold hover:bg-white/20 transition duration-200
                            "
                        >
                            취소
                        </button>

                        <button
                            onClick={handleSave}
                            className="
                                bg-custom-orange text-white py-2 px-5
                                rounded-lg text-md font-bold shadow-lg
                                hover:opacity-90 transition duration-200
                            "
                        >
                            저장
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodaySentence;
