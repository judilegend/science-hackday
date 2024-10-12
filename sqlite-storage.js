import SQLite from "react-native-sqlite-storage";

if (window.openDatabase) {
  SQLite.openDatabase = (name, version, description, size) => {
    return window.openDatabase(name, version, description, size);
  };
} else {
  console.warn("WebSQL is not supported in this browser");
}

export default SQLite;
