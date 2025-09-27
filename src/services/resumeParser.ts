import mammoth from 'mammoth';
import { ResumeData } from '../types';
import { pdfjsLib } from '../config/pdfjs';

class ResumeParserService {
  async parseResume(file: File): Promise<ResumeData> {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    let rawText: string;

    if (fileExtension === 'pdf') {
      rawText = await this.parsePDF(file);
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      rawText = await this.parseDOCX(file);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }

    const parsedData = this.extractResumeData(rawText);
    
    return {
      ...parsedData,
      rawText,
      fileName,
    };
  }

  private async parsePDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      throw new Error('Failed to parse PDF file');
    }
  }

  private async parseDOCX(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse DOCX file');
    }
  }

  private extractResumeData(text: string): Partial<ResumeData> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const data: Partial<ResumeData> = {};
    
    // Extract email using regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailRegex);
    if (emailMatch) {
      data.email = emailMatch[0];
    }
    
    // Extract phone using various formats
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) {
      data.phone = phoneMatch[0];
    }
    
    // Extract LinkedIn profile
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i;
    const linkedinMatch = text.match(linkedinRegex);
    if (linkedinMatch) {
      data.linkedin = linkedinMatch[0];
    }
    
    // Extract GitHub profile
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/i;
    const githubMatch = text.match(githubRegex);
    if (githubMatch) {
      data.github = githubMatch[0];
    }
    
    // Extract name - improved pattern matching
    if (lines.length > 0) {
      // Look for potential name patterns (capitalized words, not too long)
      const potentialNames = lines.filter(line => {
        const words = line.split(' ');
        return words.length >= 2 && 
               words.length <= 4 && 
               words.every(word => /^[A-Z][a-z]+$/.test(word)) &&
               line.length < 50 &&
               !line.toLowerCase().includes('resume') &&
               !line.toLowerCase().includes('cv') &&
               !line.toLowerCase().includes('curriculum');
      });
      
      if (potentialNames.length > 0) {
        data.name = potentialNames[0];
      } else {
        // Fallback to first line if it looks like a name
        const firstLine = lines[0];
        if (firstLine.length < 50 && 
            /^[A-Za-z\s]+$/.test(firstLine) &&
            !firstLine.toLowerCase().includes('resume') &&
            !firstLine.toLowerCase().includes('cv')) {
          data.name = firstLine;
        }
      }
    }
    
    // Extract skills section
    data.skills = this.extractSkills(text);
    
    // Extract experience information
    data.experience = this.extractExperience(text);
    
    // Extract education information
    data.education = this.extractEducation(text);
    
    return data;
  }

  private extractSkills(text: string): string[] {
    const skills: string[] = [];
    
    // Common programming languages and technologies
    const techKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
      'React', 'Angular', 'Vue', 'Node\\.js', 'Express', 'Next\\.js', 'Nuxt\\.js',
      'HTML', 'CSS', 'Sass', 'Less', 'Tailwind', 'Bootstrap',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
      'REST', 'GraphQL', 'Microservices', 'API', 'JSON', 'XML',
      'Agile', 'Scrum', 'DevOps', 'CI/CD', 'TDD', 'BDD'
    ];
    
    // Find mentioned technologies
    techKeywords.forEach(tech => {
      try {
        // Handle special characters in tech names
        const escapedTech = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedTech}\\b`, 'i');
        if (regex.test(text)) {
          // Convert escaped versions back to display names
          const displayName = tech.replace(/\\/g, '');
          skills.push(displayName);
        }
      } catch (error) {
        // Skip problematic patterns
        console.warn(`Skipping problematic tech keyword: ${tech}`);
      }
    });
    
    // Look for skills section
    const skillsSectionRegex = /(?:skills?|technologies?|tech stack|programming languages?)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i;
    const skillsSectionMatch = text.match(skillsSectionRegex);
    
    if (skillsSectionMatch) {
      const skillsText = skillsSectionMatch[0];
      const additionalSkills = skillsText
        .split(/[,;•\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1 && skill.length < 50)
        .filter(skill => !skill.toLowerCase().includes('skill'));
      
      additionalSkills.forEach(skill => {
        if (!skills.includes(skill)) {
          skills.push(skill);
        }
      });
    }
    
    return skills.slice(0, 20); // Limit to top 20 skills
  }

  private extractExperience(text: string): string[] {
    const experience: string[] = [];
    
    // Look for work experience section
    const experienceRegex = /(?:experience|work history|employment|professional experience)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i;
    const experienceMatch = text.match(experienceRegex);
    
    if (experienceMatch) {
      const experienceText = experienceMatch[0];
      const lines = experienceText.split('\n').filter(line => line.trim().length > 10);
      
      lines.forEach(line => {
        // Look for job titles and companies
        const jobTitleRegex = /(?:software engineer|developer|programmer|analyst|consultant|manager|lead|senior|junior|intern)/i;
        if (jobTitleRegex.test(line) && line.length < 100) {
          experience.push(line.trim());
        }
      });
    }
    
    // Look for years of experience
    const yearsRegex = /(\d+)[\s-]*(?:years?|yrs?)[\s-]*(?:of[\s-]*)?(?:experience|exp)/i;
    const yearsMatch = text.match(yearsRegex);
    if (yearsMatch) {
      experience.push(`${yearsMatch[1]} years of experience`);
    }
    
    return experience.slice(0, 10); // Limit to top 10 experiences
  }

  private extractEducation(text: string): string[] {
    const education: string[] = [];
    
    // Look for education section
    const educationRegex = /(?:education|academic|degree|university|college|school)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i;
    const educationMatch = text.match(educationRegex);
    
    if (educationMatch) {
      const educationText = educationMatch[0];
      const lines = educationText.split('\n').filter(line => line.trim().length > 5);
      
      lines.forEach(line => {
        // Look for degree types
        const degreeRegex = /(?:bachelor|master|phd|associate|diploma|certificate|degree)/i;
        if (degreeRegex.test(line) && line.length < 100) {
          education.push(line.trim());
        }
      });
    }
    
    return education.slice(0, 5); // Limit to top 5 education entries
  }
}

export const resumeParser = new ResumeParserService();
