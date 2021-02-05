import React from "react"
import { StoreContext } from "./provider"
/**
 * Access to Store Objects and Functions 
 * - 
 * Contains:
 * - Dashboard Manipulation Functions
 * - Document Manipulation Functions
 * - Global State for Local Saving & Backend Connect
 */
export const useStore = () => {
    return React.useContext(StoreContext)
}