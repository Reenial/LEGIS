// Placeholder handler for routes that exist in the skeleton but are not built yet.
// Usage: router.get('/x', notImplemented('UC-001', 'Browse posts'))
// The frontend shows its "Not implemented yet..." screen for any 501 (frontend/src/router.js).
const NOT_IMPLEMENTED_MESSAGE = 'Not implemented yet...';

function notImplemented(useCase, description) {
  return (req, res) => {
    res.status(501).json({
      error: NOT_IMPLEMENTED_MESSAGE,
      useCase,
      description,
      route: `${req.method} ${req.originalUrl}`,
    });
  };
}

module.exports = notImplemented;
module.exports.NOT_IMPLEMENTED_MESSAGE = NOT_IMPLEMENTED_MESSAGE;
