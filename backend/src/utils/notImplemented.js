// Placeholder handler for routes that exist in the skeleton but are not built yet.
// Usage: router.get('/x', notImplemented('UC-001', 'Browse posts'))
function notImplemented(useCase, description) {
  return (req, res) => {
    res.status(501).json({
      error: 'Not implemented',
      useCase,
      description,
      route: `${req.method} ${req.originalUrl}`,
    });
  };
}

module.exports = notImplemented;
