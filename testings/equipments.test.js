// Import the functions from the equipment service

const { addEquipments, updateEquipments } = require("../controllers/equipmentsController");

// Mock the database connection
jest.mock("../dbConnection", () => ({
    GYM: jest.fn(),
}));
  

describe('Equipment Service', () => {
  // Mock request and response objects
  const req = {
    body: {
      itemID: 1,
      itemName: 'Treadmill',
      qty: 5,
      purchaseDate: new Date('2022-01-01'),
      lastServiceDate: new Date('2023-01-01'),
      equipmentId: 1,
    },
  };
  const res = {};

  test('addEquipment should add new equipment', async () => {
    const result = await addEquipments(req, res);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Equipment added successfully');
  });

  test('updateEquipment should update existing equipment', async () => {
    const result = await updateEquipments(req, res);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Equipment updated successfully');
  });
});
