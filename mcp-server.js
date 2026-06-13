#!/usr/bin/env node

/**
 * GiftConcierge Model Context Protocol (MCP) Server
 * Implements the official MCP Specification v1.x over stdio.
 * Exposes GiftConcierge tools and resources to external AI clients (Claude Code, ChatGPT, Cursor, etc.).
 * 
 * Usage:
 *   node mcp-server.js [options]
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Config
const API_BASE_URL = process.env.GIFTCONCIERGE_API_URL || 'http://localhost:8080/api';
const MCP_SECRET_KEY = process.env.GIFTCONCIERGE_MCP_KEY || 'mcp-local-secret-token-54321';
const APP_BASE_URL = process.env.GIFTCONCIERGE_APP_URL || 'http://localhost:3000';

// Logger for debugging (write to file since stdout is reserved for JSON-RPC)
const LOG_FILE = path.join(__dirname, 'mcp-server.log');
function log(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${msg}\n`);
}

log('GiftConcierge MCP Server starting...');

// Standard Input Buffer
let inputBuffer = '';

process.stdin.on('data', (chunk) => {
  inputBuffer += chunk.toString();
  processMessages();
});

function processMessages() {
  let newlineIndex;
  while ((newlineIndex = inputBuffer.indexOf('\n')) !== -1) {
    const rawMessage = inputBuffer.slice(0, newlineIndex).trim();
    inputBuffer = inputBuffer.slice(newlineIndex + 1);
    
    if (rawMessage) {
      try {
        const message = JSON.parse(rawMessage);
        handleMessage(message);
      } catch (err) {
        log(`Error parsing message: ${err.message}. Raw: ${rawMessage}`);
        sendError(null, -32700, 'Parse error');
      }
    }
  }
}

function sendResponse(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result
  };
  const raw = JSON.stringify(response) + '\n';
  process.stdout.write(raw);
  log(`Sent response for ID: ${id}`);
}

function sendError(id, code, message, data = null) {
  const response = {
    jsonrpc: '2.0',
    id,
    error: { code, message }
  };
  if (data) response.error.data = data;
  const raw = JSON.stringify(response) + '\n';
  process.stdout.write(raw);
  log(`Sent error for ID: ${id}. Code: ${code}, Msg: ${message}`);
}

// REST API Helpers
function apiRequest(method, endpoint, payload = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint}`;
    log(`API Request: ${method} ${url}`);
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-MCP-Token': MCP_SECRET_KEY
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const transport = parsedUrl.protocol === 'https:' ? https : http;
    const req = transport.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        log(`API Response: ${res.statusCode}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`API returned status ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      log(`API Request Error: ${err.message}`);
      reject(err);
    });
    
    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

// Handle Handshake & Protocol requests
function handleMessage(message) {
  const { jsonrpc, method, params, id } = message;
  
  if (jsonrpc !== '2.0') {
    return sendError(id, -32600, 'Invalid Request');
  }
  
  log(`Received request: ${method} (ID: ${id})`);
  
  switch (method) {
    case 'initialize':
      return sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: {
          name: 'giftconcierge-mcp-server',
          version: '1.0.0'
        }
      });
      
    case 'notifications/initialized':
      log('MCP client initialized successfully');
      return; // Notifications do not send a response
      
    case 'tools/list':
      return sendResponse(id, {
        tools: [
          {
            name: 'list_gifts',
            description: 'Browse the gift catalog with filters for category, price, and emotions.',
            inputSchema: {
              type: 'object',
              properties: {
                keyword: { type: 'string', description: 'Optional text search across gift names and descriptions' },
                category: { type: 'string', description: 'Filter by category (e.g. Books, Electronics, Experiences, Soft Toys, Traditional Gifts)' },
                maxPrice: { type: 'number', description: 'Maximum price filter' },
                emotion: { type: 'string', description: 'Filter by emotion tag (e.g. romantic, sentimental, thoughtful, cozy, wellness)' }
              }
            }
          },
          {
            name: 'get_recipients',
            description: 'Retrieve all saved recipients under the user profile to review birthdays/relationship vault details.',
            inputSchema: {
              type: 'object',
              properties: {
                userToken: { type: 'string', description: 'JWT authentication token of the active user' }
              },
              required: ['userToken']
            }
          },
          {
            name: 'get_occasions',
            description: 'Retrieve upcoming calendar occasions and countdown milestones.',
            inputSchema: {
              type: 'object',
              properties: {
                userToken: { type: 'string', description: 'JWT authentication token of the active user' }
              },
              required: ['userToken']
            }
          },
          {
            name: 'get_recommendations',
            description: 'Query the AI Recommendation engine to get top-scored gift recommendations for a recipient.',
            inputSchema: {
              type: 'object',
              properties: {
                age: { type: 'integer', description: 'Age of the recipient' },
                gender: { type: 'string', description: 'Gender of the recipient' },
                relationship: { type: 'string', description: 'Relationship (e.g. Sister, Friend, Wife, Mother)' },
                interests: { type: 'string', description: 'Comma-separated list of interests/hobbies' },
                budget: { type: 'number', description: 'Budget limit' },
                occasion: { type: 'string', description: 'Occasion name (e.g. Birthday, Anniversary)' }
              },
              required: ['age', 'relationship', 'interests', 'budget', 'occasion']
            }
          },
          {
            name: 'place_order',
            description: 'Create a pending order for a catalog gift. Admins verify payment in GiftConcierge before stock is decremented.',
            inputSchema: {
              type: 'object',
              properties: {
                userToken: { type: 'string', description: 'JWT authentication token of the active user' },
                recipientId: { type: 'integer', description: 'ID of the recipient' },
                giftId: { type: 'integer', description: 'Optional catalog gift ID. If omitted, giftName is used.' },
                giftName: { type: 'string', description: 'Name of the gift' },
                quantity: { type: 'integer', description: 'Quantity to order. Defaults to 1.' },
                message: { type: 'string', description: 'Personal greeting message card text' },
                address: { type: 'string', description: 'Delivery address or dispatch notes' },
                courierType: { type: 'string', description: 'Courier type, e.g. STANDARD, EXPRESS, HAND_DELIVERY' },
                transactionId: { type: 'string', description: 'Manual payment reference/UTR if already collected' },
                paymentScreenshot: { type: 'string', description: 'Optional data URL or URL for the payment receipt screenshot' }
              },
              required: ['userToken', 'recipientId', 'giftName', 'address']
            }
          }
        ]
      });

    case 'resources/list':
      return sendResponse(id, {
        resources: [
          {
            uri: 'giftconcierge://app',
            name: 'GiftConcierge App',
            description: 'Frontend URL, backend API URL, and available MCP environment variables.',
            mimeType: 'application/json'
          },
          {
            uri: 'giftconcierge://catalog',
            name: 'Gift Catalog',
            description: 'Current public catalog returned by the backend.',
            mimeType: 'application/json'
          }
        ]
      });

    case 'resources/read':
      return handleResourceRead(id, params?.uri);
      
    case 'tools/call':
      return handleToolCall(id, params?.name, params?.arguments);
      
    default:
      return sendError(id, -32601, `Method not found: ${method}`);
  }
}

async function handleToolCall(id, toolName, args) {
  log(`Executing tool: ${toolName} with args: ${JSON.stringify(args)}`);
  
  try {
    switch (toolName) {
      case 'list_gifts': {
        const { keyword, category, maxPrice, emotion } = args || {};
        let endpoint = '/gifts/search?';
        if (keyword) endpoint += `keyword=${encodeURIComponent(keyword)}&`;
        if (category) endpoint += `category=${encodeURIComponent(category)}&`;
        if (maxPrice) endpoint += `budget=${maxPrice}&`;
        if (emotion) endpoint += `emotion=${encodeURIComponent(emotion)}&`;
        
        const gifts = await apiRequest('GET', endpoint);
        return sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(gifts, null, 2)
            }
          ]
        });
      }
      
      case 'get_recipients': {
        const { userToken } = args;
        const recipients = await apiRequest('GET', '/recipients', null, userToken);
        return sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(recipients, null, 2)
            }
          ]
        });
      }
      
      case 'get_occasions': {
        const { userToken } = args;
        const occasions = await apiRequest('GET', '/occasions/upcoming', null, userToken);
        return sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(occasions, null, 2)
            }
          ]
        });
      }
      
      case 'get_recommendations': {
        const { age, gender, relationship, interests, budget, occasion } = args;
        const payload = { recipientAge: age, gender, relationship, interests, budget, occasion };
        const suggestions = await apiRequest('POST', '/ai/recommend', payload);
        return sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(suggestions, null, 2)
            }
          ]
        });
      }
      
      case 'place_order': {
        const {
          userToken,
          recipientId,
          giftId,
          giftName,
          quantity = 1,
          message,
          address,
          courierType = 'STANDARD',
          transactionId = 'MCP-PENDING',
          paymentScreenshot = ''
        } = args;
        const payload = {
          items: [
            {
              gift: {
                id: giftId || null,
                name: giftName
              },
              quantity,
              recipientId
            }
          ],
          address: message ? `${address}\nGift note: ${message}` : address,
          courierType,
          transactionId,
          paymentScreenshot
        };
        const order = await apiRequest('POST', '/orders', payload, userToken);
        return sendResponse(id, {
          content: [
            {
              type: 'text',
              text: `Pending order created successfully. Order ID: ${order.orderId || 'available in GiftConcierge admin orders'}.`
            }
          ]
        });
      }
      
      default:
        return sendError(id, -32602, `Invalid tool name: ${toolName}`);
    }
  } catch (err) {
    log(`Tool execution error for ${toolName}: ${err.message}`);
    return sendResponse(id, {
      content: [
        {
          type: 'text',
          text: `Error invoking tool: ${err.message}`
        }
      ],
      isError: true
    });
  }
}

async function handleResourceRead(id, uri) {
  try {
    switch (uri) {
      case 'giftconcierge://app':
        return sendResponse(id, {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                appBaseUrl: APP_BASE_URL,
                apiBaseUrl: API_BASE_URL,
                launchCommand: 'node mcp-server.js',
                environment: {
                  GIFTCONCIERGE_API_URL: API_BASE_URL,
                  GIFTCONCIERGE_APP_URL: APP_BASE_URL,
                  GIFTCONCIERGE_MCP_KEY: 'optional shared token'
                },
                tools: ['list_gifts', 'get_recipients', 'get_occasions', 'get_recommendations', 'place_order']
              }, null, 2)
            }
          ]
        });

      case 'giftconcierge://catalog': {
        const gifts = await apiRequest('GET', '/gifts');
        return sendResponse(id, {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(gifts, null, 2)
            }
          ]
        });
      }

      default:
        return sendError(id, -32602, `Unknown resource URI: ${uri}`);
    }
  } catch (err) {
    return sendResponse(id, {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `Error reading resource: ${err.message}`
        }
      ],
      isError: true
    });
  }
}
