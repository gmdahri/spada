const request = require('supertest');
const express = require('express');
const app = express();

const { getTrends } = require('../Controller/SpadaController');

const mockRequest = (body) => ({
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('getTrends Controller', () => {
  it('should return the expected response for a valid request', async () => {
    const mockReq = mockRequest({ keyword: ['cycling'] });
    const mockRes = mockResponse();


    await getTrends(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: expect.any(Array),
    });
  });

});
