import { assertType, expect } from "vitest";

/**
 * Validate that an object is a UserData object
 * @param {Object} obj
 */
export const validateUserSchema = (obj: any) => {
    const NUM_KEYS = 7;
    expect(Object.keys(obj)).toHaveLength(NUM_KEYS);
    expect(obj.user_id).toBeGreaterThan(0);
    assertType<string>(obj.first_name);
    assertType<string>(obj.last_name);
    assertType<string>(obj.email);
    assertType<string>(obj.password_hash);
    assertType<string>(obj.created_at);
};
