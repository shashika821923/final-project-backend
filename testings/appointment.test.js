const { getAllAppointments } = require("../services/appointmentsService");

// Mock the SQL connection and query method
jest.mock('mssql', () => ({
    connect: jest.fn(),
    query: jest.fn(),
  }));
  
  // Import the function from the appointments service
  
  describe('Appointments Service', () => {
    // Mock request and response objects
    const req = {
      body: {
        status: '1', // Example status for testing
      },
    };
    const res = {};
  
    test('getAllAppointments should retrieve appointments based on status', async () => {
      // Mock the SQL query result
      const mockRecordset = [{ appointmentId: 1, userId: 1, date: '2024-05-20', time: '09:00', isDeleted: 0, isApproved: 1, isCompleted: 0, firstName: 'John', secondName: 'Doe' }];
      const mockQueryResult = { recordset: mockRecordset };
  
      sql.query.mockResolvedValueOnce(mockQueryResult);
  
      const result = await getAllAppointments(req, res);
  
      expect(sql.query).toHaveBeenCalledWith(expect.any(String));
  
      expect(result).toEqual(mockRecordset);
    });
  

  });
  