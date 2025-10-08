# OpenTUI Integration

## Build Process

OpenTUI is a git submodule at `packages/opentui/`. When making changes to the Zig native code:

1. Edit Zig files in `packages/opentui/packages/core/src/zig/`
2. Run `bun run build:native` from `packages/opentui/packages/core/`
3. The build script automatically:
   - Compiles native binaries for all platforms (darwin, linux, windows) × (x64, arm64)
   - Places them in `packages/core/node_modules/@opentui/core-{platform}-{arch}/`
   - **Copies the darwin-arm64 binary to `packages/opentui/core-darwin-arm64/libopentui.dylib`** for local development
4. **IMPORTANT**: After building, you must also copy the binary to `node_modules/@opentui/core-darwin-arm64/` in the project root:
   ```bash
   cp packages/opentui/packages/core/src/zig/lib/aarch64-macos/libopentui.dylib node_modules/@opentui/core-darwin-arm64/libopentui.dylib
   ```
5. Reinstall dependencies to ensure fresh binaries are used:
   ```bash
   rm -rf node_modules && bun install
   ```
6. Rebuild the CLI with `bun run build` from `cli/`

## macOS Terminal Color Support

The Zig code in `terminal.zig` detects macOS (`.macos`) and disables RGB colors, falling back to 256-color ANSI codes for better compatibility with macOS Terminal.app and other terminals that don't support RGB properly.

Key implementation details:
- Checks `TERM_PROGRAM` environment variable for `Apple_Terminal`
- Uses `builtin.os.tag == .macos` (not `.darwin`) in Zig
- Automatically disables RGB on macOS for better terminal compatibility

## Published Packages

The root-level directories (`core-darwin-arm64/`, `core-darwin-x64/`, etc.) are separate npm packages that get published. The build script copies freshly built binaries to these locations.

**Troubleshooting**: If colors still don't work after rebuilding:
1. Check binary timestamps: `ls -la packages/opentui/packages/core/src/zig/lib/aarch64-macos/libopentui.dylib`
2. Verify it was copied: `ls -la node_modules/@opentui/core-darwin-arm64/libopentui.dylib`
3. The timestamps and file sizes should match the freshly built binary