const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ __id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ __id: params.id })
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
      .then(({ __id }) => {
        return User.findOneAndUpdate(
          { __id: params.userId },
          { $push: { thoughts: __id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(400).json({ error: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ __id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(400).json({ error: "No thought found with this id" });
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
            res.status(400).json({ error: "No thought found with this id" });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  }
};

module.exports = thoughtController;
