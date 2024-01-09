export function setup(ctx) {
    // Create a section for general settings
    ctx.settings.section('General').add({
        type: 'number',
        name: 'speedupFactor',
        label: 'Speedup Factor',
        hint: 'Speeds up the game by this amount.',
        default: 5,
    });

    // Create settings for each skill
    const skillSettings = {};
    const skills = ['attack', 'strength', 'defense', 'hitpoints', 'ranged', 'magic', 'prayer', 'cooking', 'woodcutting', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];
    
    for (const skill of skills) {
        skillSettings[skill] = ctx.settings.section(skill).add({
            type: 'number',
            name: `speedupFactor_${skill}`,
            label: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Speedup Factor`,
            hint: `Speeds up ${skill} by this amount.`,
            default: 1,
        });
    }

    // Patch the runTicks function
    ctx.patch(Game, 'runTicks').before(function (ticksToRun) {
        const generalSpeedupFactor = ctx.settings.section('General').get('speedupFactor');
        
        // Create an object to store the speedup factors for each skill
        const skillSpeedupFactors = {};
        for (const skill of skills) {
            skillSpeedupFactors[skill] = skillSettings[skill].get(`speedupFactor_${skill}`);
        }

        // Multiply the ticksToRun by the appropriate speedup factor for each skill
        const modifiedTicks = {};
        for (const skill of skills) {
            modifiedTicks[skill] = skillSpeedupFactors[skill] * ticksToRun;
        }

        return modifiedTicks;
    });
}
