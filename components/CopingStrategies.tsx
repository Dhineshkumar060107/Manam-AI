import React from 'react';

const StrategyCard: React.FC<{ title: string; description: string; effectiveness: string; icon: string }> = ({ title, description, effectiveness, icon }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-start space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm mb-2">{description}</p>
            <div className="text-xs font-medium bg-green-500/30 text-green-300 px-2 py-1 rounded-full inline-block">
                Effectiveness: {effectiveness}
            </div>
        </div>
    </div>
);

export const CopingStrategies: React.FC = () => {
    // This data would be dynamic and based on user tracking in a full app
    const strategies = [
        { title: "Mindful Breathing", description: "5 minutes of deep breathing exercises.", effectiveness: "Improved mood 4/5 times", icon: "🧘" },
        { title: "Journaling", description: "Writing down thoughts and feelings before bed.", effectiveness: "Improved mood 3/4 times", icon: "✍️" },
        { title: "Evening Walk", description: "A 15-minute walk after dinner.", effectiveness: "Improved mood 5/7 times", icon: "🚶" },
    ];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Coping Strategies</h1>
                <p className="text-lg text-gray-400">Explore and track the effectiveness of different wellness techniques.</p>
            </header>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Coping Strategy Effectiveness</h2>
                <div className="space-y-4">
                    {strategies.map((strategy, index) => (
                        <StrategyCard key={index} {...strategy} />
                    ))}
                </div>
            </div>
        </div>
    );
};