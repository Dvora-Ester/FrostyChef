// Unit test לדוגמה (Backend)
test('Validation: notes should be a string', () => {
  const notes = "No onions";
  expect(typeof notes).toBe('string');
});