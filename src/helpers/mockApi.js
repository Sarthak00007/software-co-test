// Mock API helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockProjects = [
  {
    id: '1',
    customer: 'Olivia Martin',
    refNumber: '89PQRS6789T1U2V3',
    projectName: 'Sarah Williams',
    projectNumber: 'PQRST9012R',
    areaLocation: 'Telangana',
    address: 'Mumbai, Maharastra',
    status: 'Processing',
    dueDate: '2024-02-14',
    contact: 'Sarah Williams',
    comments: 'Initial project setup',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    customer: 'Michael Jones',
    refNumber: '67KLMN2345P6Q7R8',
    projectName: 'Robert Johnson',
    projectNumber: 'ABCDE1234F',
    areaLocation: 'Uttar Pradesh',
    address: 'Bhiwani, Haryana',
    status: 'Completed',
    dueDate: '2024-02-15',
    contact: 'Robert Johnson',
    comments: 'Project completed successfully',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    customer: 'John Doe',
    refNumber: '23PQRS54567T8U9V1',
    projectName: 'Isabella Anderson',
    projectNumber: 'XYZAB6789C',
    areaLocation: 'Delhi',
    address: 'Avadi, Tamil Nadu',
    status: 'On Hold',
    dueDate: '2024-02-16',
    contact: 'Isabella Anderson',
    comments: 'Waiting for approval',
    createdAt: '2023-10-25',
  },
  {
    id: '4',
    customer: 'Ella Lewis',
    refNumber: '78STUV2345W6X7YB',
    projectName: 'Christopher White',
    projectNumber: 'PQRST9012R',
    areaLocation: 'Karnataka',
    address: 'North Dum Dum, West Bengal',
    status: 'In Transit',
    dueDate: '2024-02-17',
    contact: 'Christopher White',
    comments: 'In progress',
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    customer: 'James Rodriguez',
    refNumber: '45KLMN8901P2Q3R4',
    projectName: 'Jane Smith',
    projectNumber: 'RSTUV90128',
    areaLocation: 'Andhra Pradesh',
    address: 'Anantapur, Andhra Pradesh',
    status: 'Completed',
    dueDate: '2024-02-18',
    contact: 'Jane Smith',
    comments: 'Delivered',
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    customer: 'Isabella Anderson',
    refNumber: '23PQRS4567T8U9V1',
    projectName: 'Olivia Martin',
    projectNumber: 'ABCDE6789Y',
    areaLocation: 'Odisha',
    address: 'Farrukhabad, Uttar Pradesh',
    status: 'Processing',
    dueDate: '2024-02-19',
    contact: 'Olivia Martin',
    comments: 'Under review',
    createdAt: '2024-01-12',
  },
  {
    id: '7',
    customer: 'Sarah Williams',
    refNumber: '89KLMN6789P1Q2R3',
    projectName: 'John Doe',
    projectNumber: 'VWXYZ2345X',
    areaLocation: 'West Bengal',
    address: 'Vadodara, Gujarat',
    status: 'Rejected',
    dueDate: '2024-02-20',
    contact: 'John Doe',
    comments: 'Requirements not met',
    createdAt: '2024-01-08',
  },
  {
    id: '8',
    customer: 'Sophia Hernandez',
    refNumber: '34FGH15678/9K1L2',
    projectName: 'Mia Taylor',
    projectNumber: 'RSTUV2345W',
    areaLocation: 'Uttar Pradesh',
    address: 'Loni, Uttar Pradesh',
    status: 'On Hold',
    dueDate: '2024-02-21',
    contact: 'Mia Taylor',
    comments: 'Pending client feedback',
    createdAt: '2024-01-18',
  },
  {
    id: '9',
    customer: 'Sarah Williams',
    refNumber: '89PQRS6789T1U2V3',
    projectName: 'James Rodriguez',
    projectNumber: 'DEFGH6789D',
    areaLocation: 'Madhya Pradesh',
    address: 'Bhilwara, Rajasthan',
    status: 'In Transit',
    dueDate: '2024-02-22',
    contact: 'James Rodriguez',
    comments: 'Shipping in progress',
    createdAt: '2024-01-22',
  },
  {
    id: '10',
    customer: 'Sophia Hernandez',
    refNumber: '12ABCDE1234F125',
    projectName: 'Robert Johnson',
    projectNumber: 'LMNOP5678V',
    areaLocation: 'Madhya Pradesh',
    address: 'Raichur, Karnataka',
    status: 'Completed',
    dueDate: '2024-02-23',
    contact: 'Robert Johnson',
    comments: 'Successfully completed',
    createdAt: '2024-01-25',
  },
];

let mockEstimations = [
  {
    id: '1',
    version: '00001',
    project: 'Christine Brooks',
    client: '089 Kutch Green Apt. 448',
    createdAt: '2019-09-04',
    lastModified: '2022-01-12',
    status: 'Created',
    sections: [
      {
        id: 's1',
        name: 'Development',
        items: [
          {
            id: 'i1',
            title: 'Frontend Development',
            description: 'React application development',
            unit: 'hours',
            quantity: 200,
            price: 75,
            margin: 20,
            total: 18000,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    version: '00002',
    project: 'Rosie Pearson',
    client: '979 Immanuel Ferry Suite 526',
    createdAt: '2019-05-28',
    lastModified: '2024-07-29',
    status: 'Processing',
    sections: [
      {
        id: 's1',
        name: 'Design',
        items: [
          {
            id: 'i1',
            title: 'UI/UX Design',
            description: 'Complete design system',
            unit: 'hours',
            quantity: 80,
            price: 100,
            margin: 15,
            total: 9200,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    version: '00003',
    project: 'Darrell Caldwell',
    client: '8587 Frida Ports',
    createdAt: '2019-11-23',
    lastModified: '2022-03-16',
    status: 'Rejected',
    sections: [],
  },
  {
    id: '4',
    version: '00004',
    project: 'Gilbert Johnston',
    client: '768 Destiny Lake Suite 600',
    createdAt: '2019-02-05',
    lastModified: '2021-12-10',
    status: 'Created',
    sections: [],
  },
  {
    id: '5',
    version: '00005',
    project: 'Alan Cain',
    client: '042 Mylene Throughway',
    createdAt: '2019-07-29',
    lastModified: '2022-03-21',
    status: 'Processing',
    sections: [],
  },
  {
    id: '6',
    version: '00006',
    project: 'Alfred Murray',
    client: '543 Weimann Mountain',
    createdAt: '2019-08-15',
    lastModified: '2023-04-20',
    status: 'Created',
    sections: [],
  },
  {
    id: '7',
    version: '00007',
    project: 'Maggie Sullivan',
    client: 'New Scottieberg',
    createdAt: '2019-12-21',
    lastModified: '2023-11-16',
    status: 'Processing',
    sections: [],
  },
  {
    id: '8',
    version: '00008',
    project: 'Rosie Todd',
    client: 'New Jon',
    createdAt: '2019-04-30',
    lastModified: '2023-05-01',
    status: 'On Hold',
    sections: [],
  },
  {
    id: '9',
    version: '00009',
    project: 'Dollie Hines',
    client: '124 Lyla Forge Suite 975',
    createdAt: '2019-01-09',
    lastModified: '2022-10-23',
    status: 'In Transit',
    sections: [],
  },
];

// Projects API
export const projectsApi = {
  getAll: async (filters = {}) => {
    await delay(500);
    let filtered = [...mockProjects];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.customer?.toLowerCase().includes(searchLower) ||
          p.projectName?.toLowerCase().includes(searchLower) ||
          p.refNumber?.toLowerCase().includes(searchLower) ||
          p.projectNumber?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      if (typeof filters.status === 'string' && filters.status.includes(',')) {
        const statuses = filters.status.split(',');
        filtered = filtered.filter(p => statuses.includes(p.status));
      } else if (filters.status) {
        filtered = filtered.filter(p => p.status === filters.status);
      }
    }

    if (filters.date) {
      filtered = filtered.filter(p => p.dueDate === filters.date);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    return filtered;
  },

  getById: async (id) => {
    await delay(300);
    return mockProjects.find(p => p.id === id);
  },

  create: async (project) => {
    await delay(500);
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      manager: project.manager || '',
      staff: project.staff || '',
      email: project.email || '',
    };
    mockProjects.push(newProject);
    return newProject;
  },

  update: async (id, project) => {
    await delay(500);
    const index = mockProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProjects[index] = { ...mockProjects[index], ...project };
      return mockProjects[index];
    }
    throw new Error('Project not found');
  },

  delete: async (id) => {
    await delay(300);
    mockProjects = mockProjects.filter(p => p.id !== id);
    return { success: true };
  },
};

// Estimations API
export const estimationsApi = {
  getAll: async (filters = {}) => {
    await delay(500);
    let filtered = [...mockEstimations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.project?.toLowerCase().includes(searchLower) ||
          e.title?.toLowerCase().includes(searchLower) ||
          e.client?.toLowerCase().includes(searchLower) ||
          e.version?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    return filtered;
  },

  getById: async (id) => {
    await delay(300);
    return mockEstimations.find(e => e.id === id);
  },

  create: async (estimation) => {
    await delay(500);
    const today = new Date().toISOString().split('T')[0];
    const newEstimation = {
      ...estimation,
      id: Date.now().toString(),
      createdAt: today,
      lastModified: estimation.lastModified || today,
      version: estimation.version || String(mockEstimations.length + 1).padStart(5, '0'),
    };
    mockEstimations.push(newEstimation);
    return newEstimation;
  },

  update: async (id, estimation) => {
    await delay(500);
    const index = mockEstimations.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEstimations[index] = { ...mockEstimations[index], ...estimation };
      return mockEstimations[index];
    }
    throw new Error('Estimation not found');
  },

  delete: async (id) => {
    await delay(300);
    mockEstimations = mockEstimations.filter(e => e.id !== id);
    return { success: true };
  },
};

// Auth API
export const authApi = {
  login: async (email, password) => {
    await delay(500);
    if (email && password) {
      return {
        user: { id: '1', email, name: 'Admin User' },
        token: 'mock-token-' + Date.now(),
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(500);
    return {
      user: { id: Date.now().toString(), ...userData },
      token: 'mock-token-' + Date.now(),
    };
  },

  forgotPassword: async (email) => {
    await delay(500);
    if (email) {
      return { success: true, message: 'Password reset email sent' };
    }
    throw new Error('Email not found');
  },
};

