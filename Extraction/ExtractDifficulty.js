const fs = require('fs').promises;

(async () => {
    try {
        // Read and parse difficulty.json
        const difficultyData = await fs.readFile('difficulty.json', 'utf8');
        const difficultyArray = JSON.parse(difficultyData);
        
        // Read copy.json
        const copyData = await fs.readFile('copy.json', 'utf8');
        const contests = JSON.parse(copyData);
        
        // Iterate over contests and problems
        contests.forEach(contest => {
            contest.Problems.forEach(problem => {
                // Find corresponding entry in difficulty.json
                const matchingEntry = difficultyArray.find(entry => entry.problemName === problem.name);
                // Set difficulty or "Unknown" if not found
                problem.difficulty = matchingEntry ? (matchingEntry.difficulty || "Unknown") : "NA";
            });
        });
        
        // Write modified copy.json back to file
        await fs.writeFile('copy.json', JSON.stringify(contests, null, 2));
        
        console.log('Difficulty levels have been added to copy.json.');
    } catch (error) {
        console.error('Error:', error);
    }
})();





// store difficulty in another json

const fs = require('fs').promises;
const LC = require("leetcode-query");
const leetcode = new LC.LeetCode();

(async () => {
    try {
        const data = await fs.readFile('copy.json');
        let contests = JSON.parse(data);
        
        const promises = [];
        
        contests.forEach((contest, contestIndex) => {
            contest.Problems.forEach((problem, problemIndex) => {
                const problemName = problem.name;
                
                promises.push(
                    (async () => {
                        try {
                            const problemData = await leetcode.problem(problemName);
                            const difficulty = problemData.difficulty;
                            console.log(`Processed problem ${problemName}: ${difficulty}`);
                            
                            // Append the problem with difficulty to difficulty.json
                            await fs.appendFile('difficulty.json', JSON.stringify({ problemName, difficulty }) + '\n', 'utf8');
                        } catch (error) {
                            const errorFound = "NA";
                            await fs.appendFile('difficulty.json', JSON.stringify({ problemName, errorFound }) + '\n', 'utf8');
                            console.error(`Error processing problem ${problemName}:`, error);
                        }
                    })()
                );
            });
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        
        console.log('All problems have been processed and appended to difficulty.json.');
        
    } catch (error) {
        console.error('Error reading, processing, or writing the file:', error);
    }
})();

