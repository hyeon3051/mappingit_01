// sqlite
import { File, Marker, Route } from 'packages/app/types/type'
import { useSQLiteContext } from 'expo-sqlite'

export async function getFileDataById(id: number, db: ReturnType<typeof useSQLiteContext>) {
  return await db.getFirstAsync<File>('SELECT * from file where id = ?', [id])
}

export async function getMarkerById(id: number, db: ReturnType<typeof useSQLiteContext>) {
  return await db.getAllAsync<Marker>('SELECT * from marker where parent = ?', [id])
}

export async function getRouteById(id: number, db: ReturnType<typeof useSQLiteContext>) {
  return await db.getAllAsync<Route>('SELECT * from route where parent = ?', [id])
}

export async function addFile(
  { title, description }: { title: string; description: string },
  db: ReturnType<typeof useSQLiteContext>
) {
  return await db.runAsync(
    `CREATE TABLE IF NOT EXISTS file (id INTEGER PRIMARY KEY NOT NULL, title TEXT, description TEXT)
    INSERT INTO file (title, description) VALUES ('${title}', '${description}')
    `
  )
}

export async function addMarker(Marker: Marker, db: ReturnType<typeof useSQLiteContext>) {
  const { pos, title, description, markerIcon, markerColor, imageUri, parent } = Marker
  const stringifyPos = JSON.stringify(pos)
  const stringifyImgUri = JSON.stringify(imageUri)
  console.log(stringifyPos)
  return await db.runAsync(
    `CREATE TABLE IF NOT EXISTS marker (id INTEGER PRIMARY KEY NOT NULL, pos TEXT, title TEXT, description TEXT, markerIcon TEXT, markerColor TEXT, pathImg TEXT, parent INTEGER, imageUrl TEXT)  
    INSERT INTO marker (pos, title, description, markerIcon, markerColor, imageUrl, parent) VALUES (
    '${stringifyPos}', '${title}', '${description}', '${markerIcon}', '${markerColor}', '${stringifyImgUri}, ${parent}
    )`
  )
}

export async function addRoute(Route: Route, db: ReturnType<typeof useSQLiteContext>) {
  const { path, title, description, lineWidth, lineColor, parent } = Route
  const stringifyPath = JSON.stringify(path)
  console.log(stringifyPath)
  return await db.runAsync(
    `CREATE TABLE IF NOT EXISTS route (id INTEGER PRIMARY KEY NOT NULL, path TEXT, title TEXT, description TEXT, lineWidth TEXT, lineColor TEXT, parent INTEGER)
    INSERT INTO route (path, title, description, lineWdith, lineColor, parent) VALUES (
    '${stringifyPath}', '${title}', '${description}', '${lineWidth}', '${lineColor}', ${parent}
    )`
  )
}

// delete_flag가 true면 삭제된 것으로 간주
// delete_flag가 false면 삭제되지 않은 것으로 간주
// 맵에서 삭제된 것을 보여주지 않기 위해 delete_flag를 사용
// 수정 사항에서 회색으로 표시해주고 이후에 삭제는 delete_flag를 true로 변경
export async function deleteMarker(markerId: number, db: ReturnType<typeof useSQLiteContext>) {
  await db.execAsync(`DELETE marker WHERE id = ${markerId}`)
}

export async function deleteRoute(routeId: number, db: ReturnType<typeof useSQLiteContext>) {
  await db.execAsync(`DELETE route WHERE id = ${routeId}`)
}

export async function deleteFile(id: number, db: ReturnType<typeof useSQLiteContext>) {
  await db.execAsync(`DELETE FROM file WHERE id = ${id}`)
}

export async function updateFile(
  { title, description }: { title: string; description: string },
  fileId: number,
  db: ReturnType<typeof useSQLiteContext>
) {
  await db.execAsync(
    `UPDATE file SET title = ${title}, description = ${description} WHERE id = ${fileId}`
  )
}
