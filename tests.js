// csv

// Function to sanitize data and convert to CSV format
function convertToCSV(data) {
    const csv = data.map(row => {
        // Sanitize and enclose each value in double quotes
        const sanitizedValues = Object.values(row).map(value => {
            let sanitizedValue = value.toString().replace(/[\n\t]/g, ' '); // Replace newline characters and tabs with spaces
            if (sanitizedValue.includes(',')) {
                sanitizedValue = `"${sanitizedValue}"`; // Enclose value in double quotes if it contains a comma
            }
            return sanitizedValue;
        });
        return sanitizedValues.join(',');
    }).join('\n');
    return csv;
}

// Function to initiate download
function downloadCSV(data) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Assuming allExtractedData contains your extracted data
// Call the downloadCSV function to initiate the download
downloadCSV(allExtractedData);




























// Get COntest details 

// Get the specified element
const navElement = document.querySelectorAll('nav')[1];
// Array to store extracted data
let allExtractedData = [];

// Function to find button with innerText containing a specific number and perform additional actions before clicking
function findAndClickButtonByInnerText(number) {
    const targetClass = 'px-4';
    const elementsWithTargetClass = document.querySelectorAll('.' + targetClass);

    const elementsWithOnlyTargetClass = Array.from(elementsWithTargetClass).filter(element => {
        // Check if the element's class list contains only the target class
        return element.classList.length === 1 && element.classList.contains(targetClass);
    });

    const extractedData = elementsWithOnlyTargetClass.map(element => {
        const anchor = element.querySelector('a');
        return {
            name: anchor.innerText.trim(), // Extract the HTML text and remove leading/trailing spaces
            href: "https://www.leetcode.com" + anchor.getAttribute('href') // Get the href attribute value
        };
    });

    allExtractedData = allExtractedData.concat(extractedData); // Accumulate data
    // console.log(allExtractedData);

    const buttons = navElement.querySelectorAll(`button`);
    for (const button of buttons) {
        if (button.innerText.trim() === number.toString()) {
            button.click(); // Simulate click
            return true; // Indicate button found and clicked
        }
    }
    return false; // Indicate button not found
}

// Function to repeatedly find and click buttons from 1 onward
function clickButtonsFromOne() {
    let i = 1;
    const intervalId = setInterval(() => {
        const buttonClicked = findAndClickButtonByInnerText(i);
        if (!buttonClicked ) {
            clearInterval(intervalId); // Stop searching if no more buttons are found or 7 buttons have been clicked
            console.log(`No more buttons found with innerText ${i} onwards.`);
            console.log("All Extracted Data:", allExtractedData); // Log all extracted data
        }
        i++;
    }, 5000); // Adjust the interval as needed (milliseconds)
}

// Start clicking buttons from 1 onward
clickButtonsFromOne();