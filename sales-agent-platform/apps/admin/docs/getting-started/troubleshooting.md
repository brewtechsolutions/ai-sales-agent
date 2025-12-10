# Troubleshooting

Common issues and their solutions.

## Development Server Issues

### Port Already in Use

**Problem**: `Error: Port 5173 is already in use`

**Solution**: Change the port in `nuxt.config.ts`:
```typescript
devServer: {
  port: 5174, // Use available port
}
```

### Server Won't Start

**Problem**: Development server fails to start

**Solutions**:
1. Clear cache: `rm -rf .nuxt node_modules/.cache`
2. Reinstall dependencies: `rm -rf node_modules bun.lockb && bun install`
3. Check Node.js version: `node --version` (should be >= 18)

## Build Issues

### Build Fails

**Problem**: `bun run build` fails with errors

**Solutions**:
1. Check TypeScript errors: `bun run check-types`
2. Fix linting errors: `bun run lint`
3. Clear build cache: `rm -rf .output .nuxt`
4. Rebuild: `bun run build`

### Type Errors

**Problem**: TypeScript errors during build

**Solutions**:
1. Run type check: `bun run check-types`
2. Check `tsconfig.json` configuration
3. Ensure all types are properly imported
4. Check for missing type definitions

## Component Issues

### Component Not Rendering

**Problem**: Component doesn't appear on page

**Solutions**:
1. Check component registration
2. Verify component import path
3. Check browser console for errors
4. Ensure component is properly exported

### Styles Not Applying

**Problem**: Tailwind classes not working

**Solutions**:
1. Check `tailwind.config.js` content paths
2. Verify CSS import in `assets/css/main.css`
3. Restart dev server
4. Check for conflicting styles

### Dark Mode Not Working

**Problem**: Dark mode classes not applying

**Solutions**:
1. Check `tailwind.config.js` has `darkMode: "selector"`
2. Verify dark class is added to HTML element
3. Check CSS variables in `assets/css/main.css`
4. Ensure all components have dark mode variants

## API/Data Issues

### API Calls Failing

**Problem**: tRPC calls return errors

**Solutions**:
1. Check backend server is running
2. Verify `API_BASE_URL` in environment
3. Check network tab in browser DevTools
4. Verify authentication tokens

### Data Not Loading

**Problem**: Tables/components show no data

**Solutions**:
1. Check API endpoint is correct
2. Verify data structure matches component expectations
3. Check browser console for errors
4. Verify authentication state

## Authentication Issues

### Login Not Working

**Problem**: Can't log in

**Solutions**:
1. Check backend authentication endpoint
2. Verify credentials format
3. Check browser console for errors
4. Verify token storage

### Redirect Loops

**Problem**: Page keeps redirecting

**Solutions**:
1. Check middleware logic in `middleware/auth.ts`
2. Verify authentication state
3. Clear browser storage
4. Check route guards

## Performance Issues

### Slow Page Loads

**Problem**: Pages load slowly

**Solutions**:
1. Check network tab for slow requests
2. Optimize images and assets
3. Enable code splitting
4. Check bundle size

### Memory Leaks

**Problem**: App becomes slow over time

**Solutions**:
1. Check for event listeners not being cleaned up
2. Verify reactive refs are properly disposed
3. Check for circular references
4. Use Vue DevTools to inspect components

## Browser Compatibility

### Styles Look Different

**Problem**: Appearance differs across browsers

**Solutions**:
1. Check browser support for CSS features
2. Add vendor prefixes if needed
3. Test in multiple browsers
4. Check Tailwind browser support

### JavaScript Errors

**Problem**: Errors in specific browsers

**Solutions**:
1. Check browser console
2. Verify polyfills are included
3. Check for unsupported features
4. Update browser or add polyfills

## Still Having Issues?

If you're still experiencing problems:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [Documentation](../README.md)
3. Ask in the team chat
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Browser/OS information
   - Screenshots if applicable

