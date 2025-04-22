import * as sampleService from '../services/sampleService.js';

export const getAllItems = async (req, res) => {
  try {
    const items = await sampleService.getAllItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await sampleService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

export const createItem = async (req, res) => {
  try {
    const newItem = await sampleService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const updatedItem = await sampleService.updateItem(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deleted = await sampleService.deleteItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
