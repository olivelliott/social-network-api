const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: "Thought not found" });
            return;
        }
      })
      .catch((err) => res.status(400).json(err));
  },

  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ error: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ error: "No thought found with this id" });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ error: "No thought found with this id" });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  },

  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true }
    )
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.reactionId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  }
};

module.exports = thoughtController;
