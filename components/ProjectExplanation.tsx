import React from 'react'

const ProjectExplanation = () => {
    const primaryGreen = '#159447'
    const lightGreen = '#EAF7EF'
    const darkText = '#171717'
    const secondaryText = '#5C5C5C'

    const videoUrl =
        'https://ik.imagekit.io/abdulhamid109/Queueless-media/No%20More%20Waiting%20Queues.mp4'

    return (
        <section className="min-h-screen flex items-center bg-[#F9FAF9] px-6 md:px-16 py-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center w-full">

                <div className="text-left">
                    <span
                        className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
                        style={{
                            backgroundColor: lightGreen,
                            color: primaryGreen,
                        }}
                    >
                        The Idea
                    </span>

                    <h2
                        className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                        style={{
                            color: darkText,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Stop waiting.
                        <br />
                        Start living.
                    </h2>

                    <p
                        className="text-base md:text-lg leading-relaxed mb-8"
                        style={{
                            color: secondaryText,
                        }}
                    >
                        Every day, people lose hours standing in physical queues —
                        barbers, clinics, service centers — time they&apos;ll never get back.
                        Queueless turns that dead time into your time. Join a queue
                        remotely, watch your position update live, and get told exactly
                        when to leave. No more guessing. No more standing around.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-10">
                        <div>
                            <p
                                className="text-3xl font-bold"
                                style={{
                                    color: primaryGreen,
                                }}
                            >
                                160min
                            </p>

                            <p
                                className="text-sm mt-1"
                                style={{
                                    color: secondaryText,
                                }}
                            >
                                Average time reclaimed per visit
                            </p>
                        </div>

                        <div>
                            <p
                                className="text-3xl font-bold"
                                style={{
                                    color: primaryGreen,
                                }}
                            >
                                Live
                            </p>

                            <p
                                className="text-sm mt-1"
                                style={{
                                    color: secondaryText,
                                }}
                            >
                                Real-time queue &amp; arrival tracking
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <div
                        className="relative w-65 aspect-9/16 rounded-2xl overflow-hidden border shadow-sm bg-black"
                        style={{
                            borderColor: '#E5E7EB',
                        }}
                    >
                        <video
                            className="absolute inset-0 w-full h-full object-cover"
                            controls
                            preload="metadata"
                            playsInline
                        >
                            <source
                                src={videoUrl}
                                type="video/mp4"
                            />

                            <p className="text-white p-4">
                                Your browser can&apos;t play this video.{' '}
                                <a
                                    href={videoUrl}
                                    className="underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Watch it here instead
                                </a>
                                .
                            </p>
                        </video>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ProjectExplanation