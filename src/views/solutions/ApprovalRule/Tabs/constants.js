export const dummyOptions = {
    es_category_id: [
        { value: "1", label: "Office Supplies" },
        { value: "2", label: "IT Equipment" },
        { value: "3", label: "Furniture" },
        { value: "4", label: "Travel Expenses" },
        { value: "5", label: "Marketing Materials" },
    ],
    es_post_po_document: [
        { value: "zab", label: "ZAB" },
        { value: "aby", label: "ABY" },
        { value: "cgy", label: "CGY" },
    ],
    es_department: [
        { value: "marketing", label: "Marketing" },
        { value: "finance", label: "Finance" },
        { value: "it", label: "IT" },
        { value: "production", label: "Production" },
        { value: "maintenance", label: "Maintenance" },
        { value: "customerService", label: "Customer Service" },
        { value: "sales", label: "Sales" },
    ],
    es_company: [
        { value: "apple", label: "Apple Inc." },
        { value: "ms", label: "Microsoft Corporation" },
        { value: "amzn", label: "Amazon.com, Inc." },
        { value: "goog", label: "Alphabet Inc." },
        { value: "fb", label: "Meta Platforms, Inc." },
        { value: "easeworkai", label: "Easework AI" },
    ],
    es_country: [
        { value: "us", label: "United States" },
        { value: "cn", label: "China" },
        { value: "jp", label: "Japan" },
        { value: "de", label: "Germany" },
        { value: "uk", label: "United Kingdom" },
    ],
};
export const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "JPY", label: "JPY" },
    { value: "CNY", label: "CNY" },
];
export const conditionOperatorOptionsForAmount = [
    { value: "equal", label: "Equal" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "greater_than_equals", label: "Greater than equals to" },
    { value: "less_than_equals", label: "Less than equals to" },
    { value: "between", label: "Range" },
];
export const conditionOperatorOptionsForPredefinedFields = [
    { value: "equal", label: "Equal" },
    { value: "contains", label: "Contains" },
];
export const managers = [
    { name: "Samay Raina", title: "IT Manager" },
    { name: "Samay Raina", title: "IT Manager" },
    { name: "Samay Raina", title: "IT Manager" },
    { name: "Samay Raina", title: "IT Manager" },
];
export const roles = [{ value: "operationsManager", label: "Operations Manager" },
{ value: "operationsDirector", label: "Operations Director" },
{ value: "VPinoperations", label: "VP In Operations" },
{ value: "projectDirector", label: "Project Director" },
{ value: "ItManager", label: "IT Manager" },
{ value: "ceo", label: "CEO" },
{ value: "cto", label: "CTO" },
{ value: "financeManager", label: "Finance Manager" },
];
export const employees = [
    { value: "oliviaBenson", label: "Olivia Benson-Project Director" },
    { value: "alexTurner", label: "Alex Turner-Operations Manger" },
    { value: "janeSmith", label: "Jane Smith-Operations Director" },
    { value: "mikeJohnson", label: "Mike Johnson-VP in Operations" },
    // { value: "rathaRamananN", label: "RathaRamanan N" },
    // { value: "rajdeep", label: "Rajdeep" },
    // { value: "siddhant", label: "Siddhant" },
    // { value: "mayank", label: "Mayank" },
];
export function ListAllApprovalRules(tables) {
    const activeRules = tables.filter((rule) => rule.isActive);

    const ruleOptions = activeRules.map((rule) => {
        return {
            value: rule.name,
            label: rule.name,
            ruleId: rule.id
        }
    });
    return ruleOptions;
}
export function ListAllConditionParamters(fields) {
    const conditionParams = fields.map((data) => {
        return {
            value: data.name,
            label: data.label,
        };
    });
    return conditionParams;
}
export const removeUniqueIdfromSeletedRules = (rulesArray) => {
    return rulesArray.map(({ uniqueId, ...rest }) => rest);
}
