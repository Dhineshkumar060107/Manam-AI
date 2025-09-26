import React from 'react';

interface HomePageProps {
  navigateToLogin: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);

export const HomePage: React.FC<HomePageProps> = ({ navigateToLogin }) => {
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            {/* Navigation Bar */}
            <nav className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-md font-bold text-white">M</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">MANAM</h1>
                    </div>
                    <button onClick={navigateToLogin} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="text-center py-20 lg:py-32 px-6">
                <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Understand Your Mind, Elevate Your Well-being.
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    MANAM is your personal mental wellness companion, using AI to help you discover patterns in your mood and build a healthier, happier you.
                </p>
                <button onClick={navigateToLogin} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                    Get Started
                </button>
            </header>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-900 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why You'll Love MANAM</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon="🧠" title="AI-Powered Insights">
                            Our smart AI analyzes your journal entries to identify mood patterns and triggers you might have missed.
                        </FeatureCard>
                        <FeatureCard icon="📊" title="Track Your Progress">
                            Visualize your mood over time with beautiful charts and see your progress with streaks and goals.
                        </FeatureCard>
                        <FeatureCard icon="🛠️" title="Personalized Strategies">
                            Receive actionable suggestions and coping strategies tailored to your unique emotional landscape.
                        </FeatureCard>
                    </div>
                </div>
            </section>
            
            {/* About Section */}
            <section id="about" className="py-20 bg-gray-800/50 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-3xl font-bold mb-4">Your Safe Space for Reflection</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We believe that understanding our emotions is the first step towards mental well-being. MANAM provides a private, non-judgmental space for you to check in with yourself. Our AI is designed to be a supportive guide, not a replacement for professional help. Your data is encrypted and private, always.
                    </p>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-8 bg-gray-900">
                <div className="container mx-auto text-center text-gray-500">
                    &copy; {new Date().getFullYear()} MANAM. All rights reserved.
                </div>
            </footer>
        </div>
    );
};