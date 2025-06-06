export const validateEmail = (email: string) => {
      const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
      return email.match(regex);
};