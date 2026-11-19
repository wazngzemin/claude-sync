import Foundation
import CoreText
let input = FileHandle.standardInput.readDataToEndOfFile()
let rows = try JSONSerialization.jsonObject(with: input) as! [[String: Any]]
let result = rows.map { row -> [String: Any] in
    let s = row["text"] as! String
    let size = row["size"] as! Double
    let font = CTFontCreateWithName("PingFangSC-Regular" as CFString, size, nil)
    let attrs: [NSAttributedString.Key: Any] = [NSAttributedString.Key(kCTFontAttributeName as String): font]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string:s, attributes:attrs))
    let width = CTLineGetTypographicBounds(line, nil, nil, nil)
    return ["text":s,"width":width]
}
let output = try JSONSerialization.data(withJSONObject: result, options:[.sortedKeys])
FileHandle.standardOutput.write(output)
