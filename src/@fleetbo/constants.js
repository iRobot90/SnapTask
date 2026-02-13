/**
 * Fleetbo Application Constants
 * Centralized definition of collection names and route paths to avoid hardcoding.
 */

export const FLEETBO_DB_NAME = 'snaptask'; // Database name for the SnapTask application

export const COLLECTIONS = {
    TASKS: 'Tasks',
    USER_TASKS: 'UserTasks',
    ITEMS: 'items', // Original placeholder collection
};

export const ROUTES = {
    AUTH_GATE: '/',
    LOGIN: '/login',
    TAB_AUTH: '/auth/route',

    // Core Features
    TASK_LIST: '/tasklist',
    TASK_CREATE: '/taskcreate',
    TASK_DETAIL: '/taskdetail/:id',
    SNAP_TASK_LIST: '/snaptasklist',

    // Placeholder/Legacy Tabs
    TAB1: '/tab1',
    TAB2: '/tab2',
    TAB3: '/tab3',

    // Items
    INSERT: '/insert',
    ITEM: '/item/:id',
    SET_USER: '/setuser',

    // System
    NAVBAR: '/navbar',
    NOT_FOUND: '*',
};

export const VIEWS = {
    TASK_LIST: 'tasklist',
    TASK_CREATE: 'taskcreate',
    TAB1: 'tab1',
    TAB3: 'tab3',
    INSERT: 'insert',
    ITEM: 'item',
    TASK_DETAIL: 'taskdetail',
    SAMPLE: 'Sample',
};
